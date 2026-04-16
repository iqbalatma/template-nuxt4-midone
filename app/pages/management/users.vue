<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/base/ui/table'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import ClientSideFilter from '~/components/ClientSideFilter.vue'
import type { ModalDelete } from '#components'
import ModalFormRole from '~/components/features/ModalFormRole.vue'
import { userUserService } from '~/services/UserService'
import TH from '~/components/TH.vue'
import TD from '~/components/TD.vue'
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
            <TH icon="Hash"> NO </TH>
            <TH icon="FileText"> NAME </TH>
            <TH icon="Mail"> EMAIL </TH>
            <TH icon="Calendar"> CREATED AT </TH>
            <TH icon="Settings"> ACTIONS </TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(user, key) in usersCollection.data" :key="key">
            <TD>{{ key + 1 }}</TD>
            <TD>
              <div class="font-medium">
                {{ user.full_name }}
              </div>
              <SmallInfo>ID : {{ user.id }}</SmallInfo>
            </TD>
            <TD>{{ user.email }}</TD>
            <TD>
              <div class="flex gap-2">
                <Lucide icon="Calendar" />
                {{ user.created_at }}
              </div>
            </TD>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  </div>
</template>

<style scoped></style>
