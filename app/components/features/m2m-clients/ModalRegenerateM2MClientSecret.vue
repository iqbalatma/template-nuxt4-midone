<script setup lang="ts">
import { DialogCloseTrigger, DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import type M2MClient from '~/types/entities/m2m_client'

// Not ModalDelete: rotating a secret is not a delete, and a Trash icon on a
// rotate is exactly the kind of wrong signal someone misreads under pressure.
const emit = defineEmits<{ (e: 'confirm', id: string): void }>()

const isShowModal = ref(false)
const selected = ref<M2MClient | null>(null)

const handleModal = (isShow: boolean, client?: M2MClient) => {
  isShowModal.value = isShow
  selected.value = client ?? null
}

const onConfirm = () => {
  if (selected.value) emit('confirm', selected.value.id)
}

defineExpose({ handleModal })
</script>

<template>
  <DialogRoot
    :open="isShowModal"
    :onOpenChange="
      (d: { open: boolean }) => {
        isShowModal = d.open
      }
    "
  >
    <DialogContent class="sm:max-w-md">
      <DialogTitle>{{ $t('system.m2mClients.regenerateTitle') }}</DialogTitle>

      <div class="flex flex-col items-center gap-4 py-4 text-center">
        <div class="bg-warning/10 flex h-14 w-14 items-center justify-center rounded-full">
          <Lucide icon="RefreshCw" class="text-warning h-7 w-7" />
        </div>
        <p class="text-foreground/70 text-sm">
          {{ $t('system.m2mClients.regenerateConfirm', { client: selected?.client }) }}
        </p>
      </div>

      <div class="mt-2 flex justify-end gap-2">
        <DialogCloseTrigger as-child @click="handleModal(false)">
          <Button look="outline" variant="ghost">{{ $t('common.cancel') }}</Button>
        </DialogCloseTrigger>
        <Button variant="primary" @click="onConfirm">
          <Lucide icon="RefreshCw" class="mr-1.5 h-4 w-4" />
          {{ $t('system.m2mClients.regenerate') }}
        </Button>
      </div>
    </DialogContent>
  </DialogRoot>
</template>
