<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Lucide } from '~/base/ui/lucide'
import { TomSelect } from '~/base/ui/tom-select'
import { TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { usePermissionService } from '~/services/PermissionService'
import type Permission from '~/types/entities/permission'

definePageMeta({
  title: 'Permissions',
  pageSubTitle: 'Data list of existing permissions to assign to a role',
})

const { getAll, permissionsCollection, permissionsByGroup, loading } = usePermissionService()

onMounted(() => getAll())

const searchKey = ref('')
const selectedGroup = ref('')

// TomSelect takes {id, name} items and emits string | string[] - single select only
// ever yields a string, so collapse the array case defensively.
const groupOptions = computed(() =>
  Object.keys(permissionsByGroup.value)
    .sort()
    .map((group) => ({ id: group, name: group })),
)

const onGroupChange = (value: string | string[]) => {
  selectedGroup.value = Array.isArray(value) ? (value[0] ?? '') : value
}

const filteredPermissions = computed<Permission[]>(() => {
  const key = searchKey.value.trim().toLowerCase()

  return permissionsCollection.value.filter((permission) => {
    const matchesGroup = selectedGroup.value === '' || permission.group === selectedGroup.value
    const matchesKey =
      key === '' ||
      permission.name.toLowerCase().includes(key) ||
      (permission.description ?? '').toLowerCase().includes(key)

    return matchesGroup && matchesKey
  })
})
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 overflow-auto p-5 lg:overflow-visible">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <!-- Permissions are seeded by the backend, so this page is read-only -->
        <div class="flex items-center gap-2 text-sm text-foreground/60">
          <Lucide icon="Info" class="h-4 w-4" />
          Permissions are defined by the backend and cannot be edited here.
        </div>

        <div class="flex items-center gap-3">
          <div class="w-48">
            <TomSelect
              :model-value="selectedGroup"
              :options="groupOptions"
              placeholder="All groups"
              @update:model-value="onGroupChange"
            />
          </div>
          <ClientSideFilter v-model="searchKey" />
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center gap-3 py-16 text-foreground/50">
        <Lucide icon="LoaderCircle" class="h-5 w-5 animate-spin" />
        <span class="text-sm">Loading...</span>
      </div>

      <ClientSidePagination v-else :data="filteredPermissions" v-slot="{ data, start }">
        <TableHeader>
          <TableRow>
            <TH icon="Hash">No.</TH>
            <TH icon="Key">Name</TH>
            <TH icon="AlignLeft">Description</TH>
            <TH icon="Layers">Group</TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(permission, index) in data" :key="permission.id">
            <TD>{{ start + index }}</TD>
            <TD>
              <p class="font-medium">{{ permission.name }}</p>
              <SmallInfo>{{ permission.id }}</SmallInfo>
            </TD>
            <TD>{{ permission.description || '—' }}</TD>
            <TD>
              <Badge variant="secondary" look="outline">{{ permission.group }}</Badge>
            </TD>
          </TableRow>
        </TableBody>
      </ClientSidePagination>
    </Box>
  </div>
</template>