<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/base/ui/table'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { useRoleService } from '~/services/RoleService'
import type Role from '~/types/entities/role'
import type { ClientSidePaginationProps } from '~/types/response'
import ClientSideFilter from '~/components/ClientSideFilter.vue'
import type { ModalDelete } from '#components'
import ModalFormRole from '~/components/features/ModalFormRole.vue'
import { usePermissionService } from '~/services/PermissionService'
definePageMeta({
  title: 'Roles',
  pageSubTitle: 'Data list of roles for user',
})

const { getAll, deleteById, rolesCollection } = useRoleService()
const { permissionsCollection, getAll: getPermissions } = usePermissionService()
onMounted(async () => {
  await initialFetch()
  await getPermissions()
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

const modalFormRoleRef = useTemplateRef<InstanceType<typeof ModalFormRole> | null>(
  'modalFormRoleRef',
)
const modalDeleteRef = useTemplateRef<InstanceType<typeof ModalDelete> | null>('modalDeleteRef')
const selectedRoleId = ref<string>('')
const initialFetch = async () => {
  await getAll()
}
</script>

<template>
  <div class="grid grid-cols-12">
    <Box class="col-span-12 overflow-auto lg:overflow-visible">
      <div class="flex justify-between items-center">
        <Button look="outline" @click="modalFormRoleRef?.handleModal(true)">Add New</Button>
        <ClientSideFilter v-model="searchKey" />
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
              <div class="flex items-center gap-2.5 mb-2">
                <div
                  class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
                >
                  <Lucide icon="UserCog" class="w-4 h-4 text-primary" />
                </div>
                <p
                  class="font-semibold text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap"
                >
                  {{ role.name }}
                </p>
              </div>
              <p class="text-xs opacity-70">ID : {{ role.id }}</p>
            </TableCell>
            <TableCell>
              <span
                v-if="role.is_mutable"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium"
              >
                <Lucide icon="LockOpen" class="w-3 h-3" />
                Mutable
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-darkmode-500 text-slate-500 dark:text-slate-400 text-xs font-medium"
              >
                <Lucide icon="Lock" class="w-3 h-3" />
                Immutable
              </span>
            </TableCell>
            <TableCell>
              {{ role.created_at }}
            </TableCell>
            <TableCell>
              <div class="flex items-center" v-if="role.name !== 'Super Admin'">
                <a
                  class="mr-3 flex items-center"
                  href="#"
                  @click.prevent="modalFormRoleRef?.handleModal(true, role)"
                >
                  <Lucide class="mr-1 h-4 w-4" icon="CheckSquare" />
                  Edit
                </a>

                <a
                  v-if="role.is_mutable"
                  class="mr-3 flex items-center text-danger"
                  href="#"
                  @click.prevent="
                    () => {
                      modalDeleteRef?.handleModal(true)
                      selectedRoleId = role.id
                    }
                  "
                >
                  <Lucide class="mr-1 h-4 w-4" icon="Trash" />
                  Delete
                </a>
              </div>
              <div v-else class="font-bold">Locked</div>
            </TableCell>
          </TableRow>
        </TableBody>
      </ClientSidePagination>
    </Box>
  </div>

  <ModalDelete
    ref="modalDeleteRef"
    @submit="
      async () => {
        await deleteById(selectedRoleId)
        await initialFetch()
      }
    "
  />
  <ModalFormRole @submit="initialFetch()" :permissions="permissionsCollection" ref="modalFormRoleRef" />
</template>

<style scoped></style>
