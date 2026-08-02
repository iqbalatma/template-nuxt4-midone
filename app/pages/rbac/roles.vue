<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { TableBody, TableHeader, TableRow } from '~/base/ui/table'
import type { ModalDelete } from '#components'
import ModalFormRole from '~/components/features/ModalFormRole.vue'
import { useRoleService } from '~/services/RoleService'
import { usePermissionService } from '~/services/PermissionService'
import type Role from '~/types/entities/role'

definePageMeta({
  title: 'Roles',
  pageSubTitle: 'Data list of roles for user',
})

const { getAll, deleteById, rolesCollection, loading } = useRoleService()
const { permissionsCollection, getAll: getAllPermissions } = usePermissionService()

onMounted(async () => {
  await Promise.all([getAll(), getAllPermissions()])
})

const searchKey = ref('')
const filteredRoles = computed<Role[]>(() => {
  const key = searchKey.value.trim().toLowerCase()
  if (key === '') return rolesCollection.value

  return rolesCollection.value.filter(
    (role) =>
      role.name.toLowerCase().includes(key) ||
      (role.description ?? '').toLowerCase().includes(key),
  )
})

const modalFormRef = useTemplateRef<InstanceType<typeof ModalFormRole> | null>('modalFormRef')
const modalDeleteRef = useTemplateRef<InstanceType<typeof ModalDelete> | null>('modalDeleteRef')
const selectedRoleId = ref('')

const PERMISSION_PREVIEW_LIMIT = 3
const visiblePermissions = (role: Role) => (role.permissions ?? []).slice(0, PERMISSION_PREVIEW_LIMIT)
const hiddenPermissionCount = (role: Role) =>
  Math.max(0, (role.permissions ?? []).length - PERMISSION_PREVIEW_LIMIT)

const onConfirmDelete = async () => {
  if (await deleteById(selectedRoleId.value)) await getAll()
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 overflow-auto p-5 lg:overflow-visible">
      <div class="mb-4 flex items-center justify-between">
        <Button variant="primary" @click="modalFormRef?.handleModal(true)">
          <Lucide icon="Plus" />
          Add Role
        </Button>
        <ClientSideFilter v-model="searchKey" />
      </div>

      <div v-if="loading" class="flex items-center justify-center gap-3 py-16 text-foreground/50">
        <Lucide icon="LoaderCircle" class="h-5 w-5 animate-spin" />
        <span class="text-sm">Loading...</span>
      </div>

      <ClientSidePagination v-else :data="filteredRoles" v-slot="{ data, start }">
        <TableHeader>
          <TableRow>
            <TH icon="Hash">No.</TH>
            <TH icon="UserCog">Name</TH>
            <TH icon="ShieldCheck">Permissions</TH>
            <TH icon="Lock">Mutable</TH>
            <TH icon="Settings">Actions</TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(role, index) in data" :key="role.id">
            <TD>{{ start + index }}</TD>
            <TD>
              <p class="font-medium">{{ role.name }}</p>
              <SmallInfo>{{ role.description ?? role.id }}</SmallInfo>
            </TD>
            <TD>
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="permission in visiblePermissions(role)"
                  :key="permission.id"
                  variant="secondary"
                  look="outline"
                >
                  {{ permission.name }}
                </Badge>
                <Badge
                  v-if="hiddenPermissionCount(role) > 0"
                  variant="ghost"
                  look="outline"
                  :content="(role.permissions ?? []).map((p) => p.name).join(', ')"
                >
                  +{{ hiddenPermissionCount(role) }} more
                </Badge>
                <span v-if="(role.permissions ?? []).length === 0" class="text-sm text-foreground/40">
                  &mdash;
                </span>
              </div>
            </TD>
            <TD>
              <Badge :variant="role.is_mutable ? 'success' : 'ghost'" look="outline">
                <Lucide :icon="role.is_mutable ? 'LockOpen' : 'Lock'" />
                {{ role.is_mutable ? 'Mutable' : 'Immutable' }}
              </Badge>
            </TD>
            <TD>
              <div class="flex items-center gap-1">
                <ButtonEdit @click-edit="modalFormRef?.handleModal(true, role)" />
                <ButtonDelete
                  v-if="role.is_mutable"
                  @click-delete="
                    () => {
                      selectedRoleId = role.id
                      modalDeleteRef?.handleModal(true)
                    }
                  "
                />
              </div>
            </TD>
          </TableRow>
        </TableBody>
      </ClientSidePagination>
    </Box>
  </div>

  <ModalDelete
    ref="modalDeleteRef"
    title="Delete Role"
    message="Are you sure want to delete this role ? Users assigned to it will lose its permissions."
    @submit="onConfirmDelete"
  />

  <ModalFormRole ref="modalFormRef" :permissions="permissionsCollection" @submit="getAll()" />
</template>