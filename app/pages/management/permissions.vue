<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/base/ui/table'
import { Lucide } from '~/base/ui/lucide'
import { Input } from '~/base/ui/input'
import { useRoleService } from '~/services/RoleService'
import type Role from '~/types/entities/role'
import type { ClientSidePaginationProps } from '~/types/response'
import ClientSideFilter from '~/components/ClientSideFilter.vue'
import { usePermissionService } from '~/services/PermissionService'
import type Permission from '~/types/entities/permission'
definePageMeta({
  title: 'Permissions',
  pageSubTitle: 'Data list of existing permission to assign to role',
})

const { getAll, permissionsCollection } = usePermissionService()
onMounted(async () => {
  await getAll()
})

const searchKey = ref<string>('')
const filteredData = computed((): Permission[] => {
  const lowerCaseSearchKey = searchKey.value.toLowerCase()
  return searchKey.value === ''
    ? permissionsCollection.value
    : permissionsCollection.value.filter((permission: Permission) => {
        return permission.name?.toLocaleLowerCase().includes(lowerCaseSearchKey)
      })
})
</script>

<template>
  <div class="grid grid-cols-12">
    <Box class="col-span-12 overflow-auto lg:overflow-visible">
      <div class="flex justify-end">
        <ClientSideFilter v-model="searchKey" />
      </div>

      <ClientSidePagination
        :data="filteredData"
        v-slot="slotProps: ClientSidePaginationProps<Permission>"
      >
        <TableHeader>
          <TableRow>
            <TableHead> NO </TableHead>
            <TableHead> NAME </TableHead>
            <TableHead> DESCRIPTION </TableHead>
            <TableHead> CREATED AT </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(permission, key) in slotProps.data" :key="key">
            <TableCell>
              {{ slotProps.start + key }}
            </TableCell>
            <TableCell>
              <div>
                <p class="font-medium">{{ permission.name }}</p>
                <p class="text-xs opacity-70">ID : {{ permission.id }}</p>
              </div>
            </TableCell>
            <TableCell>
              {{ permission.description }}
            </TableCell>
            <TableCell>
              <div class="flex gap-2">
                <Lucide icon="Calendar" />
                {{ permission.created_at }}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </ClientSidePagination>
    </Box>
  </div>
</template>

<style scoped></style>
