<script setup lang="ts">
import { DialogCloseTrigger, DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import { Label } from '~/base/ui/label'
import { Input } from '~/base/ui/input'
import { Lucide } from '~/base/ui/lucide'
import { type PropType, ref, reactive } from 'vue'
import { CheckboxRoot, CheckboxLabel, CheckboxControl } from '~/base/ui/checkbox'
import type Permission from '~/types/entities/permission'
import type Role from '~/types/entities/role'
import { type RoleRequest, useRoleService } from '~/services/RoleService'
import type { ModalType } from '~/types/modal_type'

defineProps({
  permissions: {
    required: true,
    type: Object as PropType<Permission[]>,
  },
})
const { updateById, addNew } = useRoleService()
const checkedPermissions = reactive<Record<string, boolean>>({})

const getInitialFormValue = (): RoleRequest => ({
  id: null,
  name: '',
  is_mutable: true,
  permission_ids: [],
})

const form = ref<RoleRequest>(getInitialFormValue())

const resetCheckedPermissions = () => {
  Object.keys(checkedPermissions).forEach((key) => delete checkedPermissions[key])
}

const getCheckedPermissionIds = (): string[] =>
  Object.entries(checkedPermissions)
    .filter(([, checked]) => checked)
    .map(([id]) => id)

const emit = defineEmits<{
  (e: 'submit'): void
}>()
const modalType = ref<ModalType>('create')
const isShowModal = ref(false)

const handleModal = (isShow: boolean, role?: Role) => {
  isShowModal.value = isShow
  modalType.value = 'create'
  form.value = getInitialFormValue()
  resetCheckedPermissions()
  if (role) {
    modalType.value = 'edit'
    form.value.id = role.id
    form.value.name = role.name
    form.value.is_mutable = role.is_mutable
    // Pre-tick checkboxes for existing permissions
    role.permissions?.forEach((permission) => {
      checkedPermissions[permission.id] = true
    })
  }
}

const onSubmit = async () => {
  form.value.permission_ids = getCheckedPermissionIds()

  if (modalType.value === 'create') {
    await addNew(form.value)
    handleModal(false)
    emit('submit')
  } else {
    if (form.value.id) {
      await updateById(form.value.id, form.value)
      handleModal(false)
      emit('submit')
    }
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
      <DialogTitle>Form Role</DialogTitle>
      <div class="grid grid-cols-12 mt-10 gap-4">
        <div class="col-span-12">
          <Label for="name">Name</Label>
          <Input
            id="name"
            name="name"
            class="mt-2"
            v-model="form.name"
            placeholder="Please enter role name"
            :disabled="!form.is_mutable"
          />
        </div>

        <div class="col-span-12">
          <Label>Permissions</Label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <CheckboxRoot
              v-for="permission in permissions"
              :key="permission.id"
              :checked="checkedPermissions[permission.id] === true"
              :onCheckedChange="(details) => { checkedPermissions[permission.id] = details.checked === true }"
            >
              <CheckboxControl />
              <CheckboxLabel>
                {{ permission.description }}
              </CheckboxLabel>
            </CheckboxRoot>
          </div>
        </div>
      </div>

      <div class="flex gap-2 justify-end mt-7">
        <DialogCloseTrigger @click="handleModal(false)">
          <Lucide icon="SquareX" />
          Close
        </DialogCloseTrigger>
        <Button variant="primary" @click="onSubmit()">
          <Lucide icon="Save" />
          Submit
        </Button>
      </div>
      <DialogCloseTrigger />
    </DialogContent>
  </DialogRoot>
</template>

<style scoped></style>
