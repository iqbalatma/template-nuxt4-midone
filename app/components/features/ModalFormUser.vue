<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PropType } from 'vue'
import { DialogCloseTrigger, DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import { Label } from '~/base/ui/label'
import { Input } from '~/base/ui/input'
import { Lucide } from '~/base/ui/lucide'
import { TomSelect } from '~/base/ui/tom-select'
import type User from '~/types/entities/user'
import type { RoleMaster } from '~/types/entities/role'
import { type UserRequest, useUserService } from '~/services/UserService'

const props = defineProps({
  roles: {
    required: true,
    type: Array as PropType<RoleMaster[]>,
  },
})

const emit = defineEmits<{ (e: 'submit'): void }>()

const { addNew, updateById, submitting } = useUserService()
const flashStore = useFlashStore()

const isShowModal = ref(false)
const modalType = ref<'create' | 'edit'>('create')
const editingId = ref<string | null>(null)

/** Optional fields are kept as strings for the inputs, then sent as null when blank */
interface UserForm {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password: string
  role_ids: string[]
}

const getInitialForm = (): UserForm => ({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  password: '',
  role_ids: [],
})
const form = ref<UserForm>(getInitialForm())

const roleOptions = computed(() => props.roles.map((role) => ({ id: role.id, name: role.name })))

const onRolesChange = (value: string | string[]) => {
  form.value.role_ids = Array.isArray(value) ? value : value === '' ? [] : [value]
}

const toRequest = (): UserRequest => {
  const request: UserRequest = {
    first_name: form.value.first_name.trim(),
    last_name: form.value.last_name.trim() || null,
    email: form.value.email.trim(),
    phone_number: form.value.phone_number.trim() || null,
    role_ids: form.value.role_ids,
  }

  // The Go UpdateRequest has no password field - only send it when creating
  if (modalType.value === 'create') request.password = form.value.password

  return request
}

const handleModal = (isShow: boolean, user?: User) => {
  isShowModal.value = isShow
  flashStore.clearMessages()
  form.value = getInitialForm()
  editingId.value = null

  if (!user) {
    modalType.value = 'create'
    return
  }

  modalType.value = 'edit'
  editingId.value = user.id
  form.value = {
    first_name: user.first_name,
    last_name: user.last_name ?? '',
    email: user.email,
    phone_number: user.phone_number ?? '',
    password: '',
    role_ids: (user.roles ?? []).map((role) => role.id),
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
    <DialogContent class="sm:max-w-200">
      <DialogTitle>{{ modalType === 'create' ? 'Create User' : 'Edit User' }}</DialogTitle>

      <div class="mt-6 grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6">
          <Label for="user-first-name">First Name</Label>
          <Input
            id="user-first-name"
            v-model="form.first_name"
            class="mt-2"
            placeholder="Enter first name"
          />
          <FormFeedback feedbackKey="first_name" />
        </div>

        <div class="col-span-12 md:col-span-6">
          <Label for="user-last-name">Last Name</Label>
          <Input
            id="user-last-name"
            v-model="form.last_name"
            class="mt-2"
            placeholder="Optional"
          />
          <FormFeedback feedbackKey="last_name" />
        </div>

        <div class="col-span-12 md:col-span-6">
          <Label for="user-email">Email</Label>
          <Input
            id="user-email"
            v-model="form.email"
            type="email"
            class="mt-2"
            placeholder="name@example.com"
          />
          <FormFeedback feedbackKey="email" />
        </div>

        <div class="col-span-12 md:col-span-6">
          <Label for="user-phone">Phone Number</Label>
          <Input
            id="user-phone"
            v-model="form.phone_number"
            class="mt-2"
            placeholder="Optional"
          />
          <FormFeedback feedbackKey="phone_number" />
        </div>

        <div v-if="modalType === 'create'" class="col-span-12 md:col-span-6">
          <Label for="user-password">Password</Label>
          <Input
            id="user-password"
            v-model="form.password"
            type="password"
            class="mt-2"
            placeholder="Minimum 8 characters"
          />
          <FormFeedback feedbackKey="password" />
          <SmallInfo>Password can only be set when creating the user.</SmallInfo>
        </div>

        <div class="col-span-12" :class="modalType === 'create' ? 'md:col-span-6' : ''">
          <Label>Roles</Label>
          <div class="mt-2">
            <TomSelect
              :model-value="form.role_ids"
              :options="roleOptions"
              :multiple="true"
              placeholder="Select roles"
              @update:model-value="onRolesChange"
            />
          </div>
          <FormFeedback feedbackKey="role_ids" />
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
          <Lucide
            :icon="submitting ? 'LoaderCircle' : 'Save'"
            :class="{ 'animate-spin': submitting }"
          />
          {{ submitting ? 'Saving...' : 'Save' }}
        </Button>
      </div>
    </DialogContent>
  </DialogRoot>
</template>