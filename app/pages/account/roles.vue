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
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'
import type Role from '~/types/entities/role'

definePageMeta({
  title: 'account.roles.title',
  pageSubTitle: 'account.roles.subtitle',
})

const { getAll, deleteById, rolesCollection, loading } = useRoleService()
// The role form only needs permissions as lookup options, so it reads the options endpoint
const { permissionOptionsCollection, getAllOptions: getPermissionOptions } = usePermissionService()
// Same reason as the user list: the options endpoint answers to its own
// permission, so a role reader without it gets the page rather than a 403.
const { hasPermission } = useAuthStore()
const canPickPermissions = computed(() => hasPermission(Permission.OptionPermissionIndex))

onMounted(async () => {
  await Promise.all([getAll(), canPickPermissions.value ? getPermissionOptions() : null])
})

const searchKey = ref('')
const filteredRoles = computed<Role[]>(() => {
  const key = searchKey.value.trim().toLowerCase()
  if (key === '') return rolesCollection.value

  return rolesCollection.value.filter(
    (role) =>
      role.name.toLowerCase().includes(key) || (role.description ?? '').toLowerCase().includes(key),
  )
})

const modalFormRef = useTemplateRef<InstanceType<typeof ModalFormRole> | null>('modalFormRef')
const modalDeleteRef = useTemplateRef<InstanceType<typeof ModalDelete> | null>('modalDeleteRef')
const selectedRoleId = ref('')

const PERMISSION_PREVIEW_LIMIT = 3
const visiblePermissions = (role: Role) =>
  (role.permissions ?? []).slice(0, PERMISSION_PREVIEW_LIMIT)
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
          {{ $t('account.roles.add') }}
        </Button>
        <ClientSideFilter v-model="searchKey" />
      </div>

      <div v-if="loading" class="flex items-center justify-center gap-3 py-16 text-foreground/50">
        <Lucide icon="LoaderCircle" class="h-5 w-5 animate-spin" />
        <span class="text-sm">{{ $t('common.loading') }}</span>
      </div>

      <ClientSidePagination v-else :data="filteredRoles" v-slot="{ data, start }">
        <TableHeader>
          <TableRow>
            <TH icon="Hash">{{ $t('common.no') }}</TH>
            <TH icon="UserCog">{{ $t('common.name') }}</TH>
            <TH icon="ShieldCheck">{{ $t('account.roles.columnPermissions') }}</TH>
            <TH icon="Lock">{{ $t('account.roles.columnMutable') }}</TH>
            <TH icon="Settings">{{ $t('common.actions') }}</TH>
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
                  {{ $t('account.roles.morePermissions', { count: hiddenPermissionCount(role) }) }}
                </Badge>
                <span
                  v-if="(role.permissions ?? []).length === 0"
                  class="text-sm text-foreground/40"
                >
                  &mdash;
                </span>
              </div>
            </TD>
            <TD>
              <Badge :variant="role.is_mutable ? 'success' : 'ghost'" look="outline">
                <Lucide :icon="role.is_mutable ? 'LockOpen' : 'Lock'" />
                {{ role.is_mutable ? $t('account.roles.mutable') : $t('account.roles.immutable') }}
              </Badge>
            </TD>
            <TD>
              <div class="flex items-center gap-2">
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
    :title="$t('account.roles.deleteTitle')"
    :message="$t('account.roles.deleteMessage')"
    @submit="onConfirmDelete"
  />

  <ModalFormRole ref="modalFormRef" :permissions="permissionOptionsCollection" @submit="getAll()" />
</template>
