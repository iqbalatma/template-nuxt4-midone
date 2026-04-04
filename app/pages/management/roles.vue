<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/base/ui/table'
import { Lucide } from '~/base/ui/lucide'
import { Input } from '~/base/ui/input'
import { useRoleService } from '~/services/RoleService'
import type Role from '~/types/entities/role'
import type { ClientSidePaginationProps } from '~/types/response'
import ClientSideFilter from '~/components/ClientSideFilter.vue'
definePageMeta({
  title: 'Roles',
  pageSubTitle: 'Data list of roles for user',
})

const { getAllData, rolesCollection } = useRoleService()
onMounted(async () => {
  await getAllData()
})

const searchKey = ref<string>('')
const filteredData = computed((): Role[] => {
  const lowerCaseSearchKey = searchKey.value.toLowerCase()
  return searchKey.value === ''
    ? rolesCollection.value
    : rolesCollection.value.filter((role: Role) => {
        return role.name?.toLocaleLowerCase().includes(lowerCaseSearchKey)
      })
})
</script>

<template>
  <div class="grid grid-cols-12">
    <Box class="col-span-12 overflow-auto lg:overflow-visible">
      <div class="flex justify-end">
        <ClientSideFilter v-model="searchKey"/>
      </div>

      <ClientSidePagination
        :data="filteredData"
        v-slot="slotProps: ClientSidePaginationProps<Role>"
      >
        <TableHeader>
          <TableRow>
            <TableHead> NO </TableHead>
            <TableHead> NAME </TableHead>
            <TableHead> MUTABLE </TableHead>
            <TableHead> CREATED AT </TableHead>
            <TableHead> ACTIONS </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(role, key) in slotProps.data" :key="key">
            <TableCell>
              {{ slotProps.start + key }}
            </TableCell>
            <TableCell>
              {{ role.name }}
            </TableCell>
            <TableCell>
              {{ role.is_mutable }}
            </TableCell>
            <TableCell>
              {{ role.created_at }}
            </TableCell>
            <TableCell>
              <div class="flex items-center">
                <a class="mr-3 flex items-center" href="">
                  <Lucide class="mr-1 h-4 w-4" icon="CheckSquare" />
                  Edit
                </a>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </ClientSidePagination>
    </Box>
  </div>
</template>

<style scoped></style>
