<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/base/ui/table'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import ClientSideFilter from '~/components/ClientSideFilter.vue'
import type { ModalDelete } from '#components'
import ModalFormRole from '~/components/features/ModalFormRole.vue'
import { userUserService } from '~/services/UserService'
definePageMeta({
  title: 'Users',
  pageSubTitle: 'List data of users',
})

const { getAllPaginated, usersCollection } = userUserService()
onMounted(async () => {
  await initialFetch()
})

const searchKey = ref<string>('')
const modalFormRoleRef = useTemplateRef<InstanceType<typeof ModalFormRole> | null>(
  'modalFormRoleRef',
)
const modalDeleteRef = useTemplateRef<InstanceType<typeof ModalDelete> | null>('modalDeleteRef')
const selectedRoleId = ref<string>('')
const initialFetch = async () => {
  await getAllPaginated()
}
</script>

<template>
  <div class="grid grid-cols-12">
    <Box class="col-span-12 overflow-auto lg:overflow-visible">
      <div class="flex justify-between items-center">
        <Button look="outline" @click="modalFormRoleRef?.handleModal(true)">Add New</Button>
        <ClientSideFilter v-model="searchKey" />
      </div>

      <Table variant="boxed">
        <TableHeader>
          <TableRow>
            <TableHead> NO </TableHead>
            <TableHead> NAME </TableHead>
            <TableHead> EMAIL </TableHead>
            <TableHead> CREATED AT </TableHead>
            <TableHead> ACTIONS </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(user, key) in usersCollection.data" :key="key">
            <TableCell>{{ key + 1 }}</TableCell>
            <TableCell>
              <div class="font-medium">
                {{ user.full_name }}
              </div>
              <SmallInfo>ID : {{ user.id }}</SmallInfo>
            </TableCell>
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>
              <div class="flex gap-2">
                <Lucide icon="Calendar" />
                {{ user.created_at }}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </Box>
  </div>
</template>

<style scoped></style>
