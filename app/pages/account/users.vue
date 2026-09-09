<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Input } from '~/base/ui/input'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import type { ModalDelete } from '#components'
import ModalFormUser from '~/components/features/ModalFormUser.vue'
import { useUserService } from '~/services/UserService'
import { useRoleService } from '~/services/RoleService'
import { useServerList } from '~/composables/useServerList'
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'

definePageMeta({
  title: 'account.users.title',
  pageSubTitle: 'account.users.subtitle',
})

const { getAllPaginated, deleteById, usersCollection, loading } = useUserService()
// The form only needs roles as lookup options
const { roleOptionsCollection, getAllOptions: getRoleOptions } = useRoleService()
// Asked for only when allowed: the endpoint is gated on its own permission, so
// fetching regardless would greet everyone who may edit users but not read the
// role list with a 403 toast on a page that otherwise loaded fine.
const { hasPermission } = useAuthStore()
const canPickRoles = computed(() => hasPermission(Permission.OptionRoleIndex))

// ?search= is also where the navbar quick search lands, so opening a user from
// there shows the same filtered list a link to it would.
const { filters, refresh: fetchUsers } = useServerList({
  filters: { search: '' },
  debounce: ['search'],
  fetch: (page, per_page, applied) => getAllPaginated({ page, per_page, ...applied }),
})

onMounted(() => {
  if (canPickRoles.value) getRoleOptions()
})

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
      <div class="mb-4 flex items-center justify-between gap-3">
        <Button variant="primary" @click="modalFormRef?.handleModal(true)">
          <Lucide icon="Plus" />
          {{ $t('account.users.add') }}
        </Button>

        <div class="relative w-full sm:w-64">
          <!-- The only always-visible text input on the page, so a password
               manager (or Chrome's own autofill) picks it as the "username"
               field and drops the saved login email into it on load. That write
               reaches `filters.search` through v-model and gets pushed to the
               URL, filtering the list nobody asked to filter. -->
          <Input
            v-model="filters.search"
            type="search"
            name="user-search"
            autocomplete="off"
            data-1p-ignore
            data-lpignore="true"
            data-bwignore
            data-form-type="other"
            :placeholder="$t('account.users.searchPlaceholder')"
            class="w-full pr-8"
          />
          <Lucide
            class="text-foreground/40 absolute inset-y-0 right-0 my-auto mr-2.5 size-4"
            icon="Search"
          />
        </div>
      </div>

      <ServerSidePagination :meta="meta" :loading="loading">
        <Table class="-mt-2" variant="boxed">
          <TableHeader>
            <TableRow>
              <TH icon="Hash">{{ $t('common.no') }}</TH>
              <TH icon="User">{{ $t('common.name') }}</TH>
              <TH icon="Mail">{{ $t('common.email') }}</TH>
              <TH icon="Phone">{{ $t('common.phone') }}</TH>
              <TH icon="UserCog">{{ $t('common.roles') }}</TH>
              <TH icon="Calendar">{{ $t('common.createdAt') }}</TH>
              <TH icon="Settings">{{ $t('common.actions') }}</TH>
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
                <div class="flex items-center gap-2">
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
    :title="$t('account.users.deleteTitle')"
    :message="$t('account.users.deleteMessage')"
    @submit="onConfirmDelete"
  />

  <ModalFormUser ref="modalFormRef" :roles="roleOptionsCollection" @submit="fetchUsers()" />
</template>
