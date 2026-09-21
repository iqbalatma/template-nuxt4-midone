<script setup lang="ts">
import { DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import { Label } from '~/base/ui/label'
import { Input } from '~/base/ui/input'
import { Lucide } from '~/base/ui/lucide'
import { useFlashStore } from '~/stores/flash'
import type M2MClient from '~/types/entities/m2m_client'
import { M2M_SCOPES } from '~/types/entities/m2m_client'
import {
  type M2MClientCreated,
  type M2MClientRequest,
  useM2MClientService,
} from '~/services/M2MClientService'

const emit = defineEmits<{
  (e: 'created', client: M2MClientCreated): void
  (e: 'updated'): void
}>()

const { addNew, updateById, submitting } = useM2MClientService()
const flashStore = useFlashStore()

const isShowModal = ref(false)
const modalType = ref<'create' | 'edit'>('create')
const editingId = ref<string | null>(null)

const getInitialForm = (): M2MClientRequest => ({ client: '', scope: [] })
const form = ref<M2MClientRequest>(getInitialForm())

// "*" is mutually exclusive with the named scopes: it already grants them, so
// storing both is redundant and misreads later as a narrower grant than it is.
const toggleScope = (scope: string, checked: boolean) => {
  if (scope === '*') {
    form.value.scope = checked ? ['*'] : []
    return
  }

  const withoutAll = form.value.scope.filter((s) => s !== '*')
  form.value.scope = checked ? [...withoutAll, scope] : withoutAll.filter((s) => s !== scope)
}

const hasAllScope = computed(() => form.value.scope.includes('*'))

const handleModal = (isShow: boolean, client?: M2MClient) => {
  isShowModal.value = isShow
  form.value = getInitialForm()
  editingId.value = null
  flashStore.errors = null

  if (client) {
    modalType.value = 'edit'
    editingId.value = client.id
    form.value = { client: client.client, scope: [...client.scope] }
  } else {
    modalType.value = 'create'
  }
}

const onSubmit = async () => {
  if (modalType.value === 'create') {
    const created = await addNew(form.value)
    if (created) {
      handleModal(false)
      emit('created', created)
    }
    return
  }

  if (await updateById(editingId.value!, form.value)) {
    handleModal(false)
    emit('updated')
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
    <DialogContent>
      <DialogTitle>
        {{
          modalType === 'create'
            ? $t('system.m2mClients.createTitle')
            : $t('system.m2mClients.editTitle')
        }}
      </DialogTitle>

      <div class="mt-6 grid gap-4">
        <div>
          <Label for="m2m-client-name">
            {{ $t('system.m2mClients.clientNameLabel') }} <RequiredMark />
          </Label>
          <Input
            id="m2m-client-name"
            v-model="form.client"
            class="mt-2"
            autocomplete="off"
            :placeholder="$t('system.m2mClients.clientNamePlaceholder')"
          />
          <FormFeedback feedbackKey="client" />
        </div>

        <p v-if="modalType === 'create'" class="text-foreground/50 text-xs">
          {{ $t('system.m2mClients.secretHint') }}
        </p>

        <div>
          <Label>{{ $t('system.m2mClients.scopeLabel') }} <RequiredMark /></Label>
          <div class="text-foreground/40 mt-0.5 text-xs">
            {{ $t('system.m2mClients.scopeHint') }}
          </div>
          <div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label
              v-for="scope in M2M_SCOPES"
              :key="scope"
              class="border-foreground/10 flex items-center gap-2 rounded-xl border p-3"
              :class="
                scope !== '*' && hasAllScope
                  ? 'cursor-not-allowed opacity-40'
                  : 'hover:border-primary/40 cursor-pointer'
              "
            >
              <input
                type="checkbox"
                class="form-checkbox text-primary h-4 w-4 shrink-0 rounded border-slate-300"
                :checked="form.scope.includes(scope)"
                :disabled="scope !== '*' && hasAllScope"
                @change="toggleScope(scope, ($event.target as HTMLInputElement).checked)"
              />
              <span class="font-mono text-sm select-none">{{ scope }}</span>
            </label>
          </div>
          <FormFeedback feedbackKey="scope" />
        </div>
      </div>

      <div class="mt-7 flex justify-end gap-2">
        <Button look="outline" variant="ghost" @click="handleModal(false)">
          <Lucide icon="X" />
          {{ $t('common.cancel') }}
        </Button>
        <Button variant="primary" :disabled="submitting" @click="onSubmit">
          <Lucide icon="Save" />
          {{ submitting ? $t('common.saving') : $t('common.confirm') }}
        </Button>
      </div>
    </DialogContent>
  </DialogRoot>
</template>
