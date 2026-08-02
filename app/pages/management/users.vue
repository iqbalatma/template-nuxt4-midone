<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import type { ModalDelete } from '#components'
import ModalFormUser from '~/components/features/ModalFormUser.vue'
import { useUserService } from '~/services/UserService'
import { useRoleService } from '~/services/RoleService'
import { getDefaultPerPage } from '~/utils/helper'

definePageMeta({
  title: 'Users',
  pageSubTitle: 'Data list of registered users',
})

const route = useRoute()

const { getAllPaginated, deleteById, usersCollection, loading } = useUserService()
// The form only needs roles as lookup options
const { rolesMasterCollection, getAllMaster: getAllMasterRoles } = useRoleService()

const fetchUsers = () =>
  getAllPaginated({
    page: Number(route.query['page']) || 1,
    per_page: Number(route.query['per_page']) || getDefaultPerPage(),
  })

// ServerSidePagination drives page/per_page through the URL, so refetch on query change
watch(() => route.query, fetchUsers, { immediate: true, deep: true })

onMounted(() => getAllMasterRoles())

const users = computed(() => usersCollection.value.data)
const meta = computed(() => usersCollection.value.meta)

const modalFormRef = useTemplateRef<InstanceType<typeof ModalFormUser> | null>('modalFormRef')
const modalDeleteRef = useTemplateRef<InstanceType<typeof ModalDelete> | null>('modalDeleteRef')
const selectedUserId = ref('')

const fullName = (user: { first_name: string; last_name: string | null }) =>
  [user.first_name, user.last_name].filter(Boolean).join(' ')

const onConfirmDelete = async () => {
  if (await deleteById(selectedUserId.value)) await fetchUsers()
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 overflow-auto p-5 lg:overflow-visible">
      <div class="mb-4 flex items-center justify-between">
        <Button variant="primary" @click="modalFormRef?.handleModal(true)">
          <Lucide icon="Plus" />
          Add User
        </Button>
      </div>

      <ServerSidePagination :meta="meta" :loading="loading">
        <Table class="-mt-2" variant="boxed">
          <TableHeader>
            <TableRow>
              <TH icon="Hash">No.</TH>
              <TH icon="User">Name</TH>
              <TH icon="Mail">Email</TH>
              <TH icon="Phone">Phone</TH>
              <TH icon="UserCog">Roles</TH>
              <TH icon="Calendar">Created At</TH>
              <TH icon="Settings">Actions</TH>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(user, index) in users" :key="user.id">
              <TD>{{ meta.from + index }}</TD>
              <TD>
                <p class="font-medium">{{ fullName(user) }}</p>
                <SmallInfo>{{ user.id }}</SmallInfo>
              </TD>
              <TD>{{ user.email }}</TD>
              <TD>{{ user.phone_number || '—' }}</TD>
              <TD>
                <div class="flex flex-wrap gap-1">
                  <Badge
                    v-for="role in user.roles ?? []"
                    :key="role.id"
                    variant="secondary"
                    look="outline"
                  >
                    {{ role.name }}
                  </Badge>
                  <span v-if="(user.roles ?? []).length === 0" class="text-sm text-foreground/40">
                    &mdash;
                  </span>
                </div>
              </TD>
              <TD>
                <div class="flex items-center gap-1.5">
                  <Lucide icon="Calendar" class="h-3.5 w-3.5 text-foreground/40" />
                  {{ user.created_at }}
                </div>
              </TD>
              <TD>
                <div class="flex items-center gap-1">
                  <ButtonEdit @click-edit="modalFormRef?.handleModal(true, user)" />
                  <ButtonDelete
                    @click-delete="
                      () => {
                        selectedUserId = user.id
                        modalDeleteRef?.handleModal(true)
                      }
                    "
                  />
                </div>
              </TD>
            </TableRow>
          </TableBody>
        </Table>
      </ServerSidePagination>
    </Box>
  </div>

  <ModalDelete
    ref="modalDeleteRef"
    title="Delete User"
    message="Are you sure want to delete this user ? This action cannot be undone."
    @submit="onConfirmDelete"
  />

  <ModalFormUser ref="modalFormRef" :roles="rolesMasterCollection" @submit="fetchUsers()" />
</template>