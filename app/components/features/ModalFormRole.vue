<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PropType } from 'vue'
import { DialogCloseTrigger, DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import { Label } from '~/base/ui/label'
import { Input } from '~/base/ui/input'
import { Textarea } from '~/base/ui/textarea'
import { Lucide } from '~/base/ui/lucide'
import type Permission from '~/types/entities/permission'
import type Role from '~/types/entities/role'
import { type RoleRequest, useRoleService } from '~/services/RoleService'

const props = defineProps({
  permissions: {
    required: true,
    type: Array as PropType<Permission[]>,
  },
})

const emit = defineEmits<{ (e: 'submit'): void }>()

const { addNew, updateById, submitting } = useRoleService()
const flashStore = useFlashStore()

const isShowModal = ref(false)
const modalType = ref<'create' | 'edit'>('create')
const editingId = ref<string | null>(null)
// Immutable roles are seeded system roles - the backend rejects renaming or deleting them
const isMutable = ref(true)

/** Description is kept as a string here for the inputs, then sent as null when blank */
interface RoleForm {
  name: string
  description: string
  permission_ids: string[]
}

const getInitialForm = (): RoleForm => ({
  name: '',
  description: '',
  permission_ids: [],
})
const form = ref<RoleForm>(getInitialForm())

const toRequest = (): RoleRequest => ({
  name: form.value.name.trim(),
  description: form.value.description.trim() || null,
  permission_ids: form.value.permission_ids,
})

const groupedPermissions = computed<[string, Permission[]][]>(() => {
  const groups = props.permissions.reduce(
    (acc, permission) => {
      const key = permission.group || 'Other'
      ;(acc[key] ??= []).push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

const isGroupFullyChecked = (permissions: Permission[]) =>
  permissions.length > 0 && permissions.every((p) => form.value.permission_ids.includes(p.id))

const toggleGroup = (permissions: Permission[]) => {
  const ids = permissions.map((p) => p.id)
  form.value.permission_ids = isGroupFullyChecked(permissions)
    ? form.value.permission_ids.filter((id) => !ids.includes(id))
    : [...new Set([...form.value.permission_ids, ...ids])]
}

const handleModal = (isShow: boolean, role?: Role) => {
  isShowModal.value = isShow
  flashStore.clearMessages()
  form.value = getInitialForm()
  editingId.value = null
  isMutable.value = true

  if (!role) {
    modalType.value = 'create'
    return
  }

  modalType.value = 'edit'
  editingId.value = role.id
  isMutable.value = role.is_mutable
  form.value = {
    name: role.name,
    description: role.description ?? '',
    permission_ids: (role.permissions ?? []).map((p) => p.id),
  }
}

const onSubmit = async () => {
  const request = toRequest()
  const isSaved =
    modalType.value === 'create'
      ? await addNew(request)
      : await updateById(editingId.value!, request)

  if (isSaved) {
    handleModal(false)
    emit('submit')
  }
}

defineExpose({ handleModal })
</script>

<template>
  <DialogRoot
    :open="isShowModal"
    :onOpenChange="
      (details: { open: boolean }) => {
        isShowModal = details.open
      }
    "
  >
    <DialogContent class="sm:max-w-250">
      <DialogTitle>{{ modalType === 'create' ? 'Create Role' : 'Edit Role' }}</DialogTitle>

      <div class="mt-6 grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-5">
          <Label for="role-name">Name</Label>
          <Input
            id="role-name"
            v-model="form.name"
            class="mt-2"
            placeholder="Enter role name"
            :disabled="!isMutable"
          />
          <FormFeedback feedbackKey="name" />
          <SmallInfo v-if="!isMutable">System role name cannot be changed.</SmallInfo>
        </div>

        <div class="col-span-12 md:col-span-7">
          <Label for="role-description">Description</Label>
          <Textarea
            id="role-description"
            v-model="form.description"
            class="mt-2"
            rows="2"
            placeholder="Short description of this role"
          />
          <FormFeedback feedbackKey="description" />
        </div>

        <div class="col-span-12">
          <div class="flex items-center justify-between">
            <Label>Permissions</Label>
            <SmallInfo>{{ form.permission_ids.length }} selected</SmallInfo>
          </div>

          <div class="mt-2 max-h-96 space-y-4 overflow-y-auto pr-1">
            <div
              v-for="[group, permissions] in groupedPermissions"
              :key="group"
              class="rounded-lg border border-foreground/10 p-3"
            >
              <CheckboxInput
                :modelValue="isGroupFullyChecked(permissions)"
                :label="group"
                class="font-medium"
                @update:modelValue="toggleGroup(permissions)"
              />
              <div class="mt-2 grid grid-cols-1 gap-2 pl-6 md:grid-cols-3">
                <CheckboxInput
                  v-for="permission in permissions"
                  :key="permission.id"
                  v-model="form.permission_ids"
                  :value="permission.id"
                  :label="permission.name"
                  :description="permission.description"
                />
              </div>
            </div>
          </div>
          <FormFeedback feedbackKey="permission_ids" />
        </div>
      </div>

      <div class="mt-7 flex justify-end gap-2">
        <DialogCloseTrigger as-child @click="handleModal(false)">
          <Button look="outline" variant="ghost">
            <Lucide icon="X" />
            Cancel
          </Button>
        </DialogCloseTrigger>
        <Button variant="primary" :disabled="submitting" @click="onSubmit">
          <Lucide :icon="submitting ? 'LoaderCircle' : 'Save'" :class="{ 'animate-spin': submitting }" />
          {{ submitting ? 'Saving...' : 'Save' }}
        </Button>
      </div>
    </DialogContent>
  </DialogRoot>
</template>