<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { Lucide } from '~/base/ui/lucide'
import type { ClientSidePaginationProps } from '~/types/response'
import ClientSideFilter from '~/components/ClientSideFilter.vue'
import { usePermissionService } from '~/services/PermissionService'
import type Permission from '~/types/entities/permission'
import TH from '~/components/TH.vue'
import TD from '~/components/TD.vue'
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
            <TH icon="Hash"> NO </TH>
            <TH icon="FileText"> NAME </TH>
            <TH icon="AlignLeft"> DESCRIPTION </TH>
            <TH icon="Calendar"> CREATED AT </TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(permission, key) in slotProps.data" :key="key">
            <TD>
              {{ slotProps.start + key }}
            </TD>
            <TD>
              <div>
                <p class="font-medium">{{ permission.name }}</p>
                <SmallInfo>ID : {{ permission.id }}</SmallInfo>
              </div>
            </TD>
            <TD>
              {{ permission.description }}
            </TD>
            <TD>
              <div class="flex gap-2">
                <Lucide icon="Calendar" />
                {{ permission.created_at }}
              </div>
            </TD>
          </TableRow>
        </TableBody>
      </ClientSidePagination>
    </Box>
  </div>
</template>

<style scoped></style>
