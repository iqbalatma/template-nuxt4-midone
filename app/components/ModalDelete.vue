<script setup lang="ts">
import { ref } from 'vue'
import { DialogCloseTrigger, DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'

const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: '',
    message: '',
  },
)

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const isShowModal = ref(false)

const handleModal = (isShow: boolean) => {
  isShowModal.value = isShow
}

const onConfirm = () => {
  emit('submit')
  handleModal(false)
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
      <DialogTitle>{{ props.title || $t('common.deleteTitle') }}</DialogTitle>
      <div class="mt-4 grid gap-4">{{ props.message || $t('common.deleteConfirmMessage') }}</div>
      <div class="mt-7 flex justify-end gap-2">
        <DialogCloseTrigger as-child @click="handleModal(false)">
          <Button look="outline" variant="ghost">
            <Lucide icon="X" />
            {{ $t('common.cancel') }}
          </Button>
        </DialogCloseTrigger>
        <Button variant="danger" @click="onConfirm()">
          <Lucide icon="Trash" />
          {{ $t('common.confirm') }}
        </Button>
      </div>
    </DialogContent>
  </DialogRoot>
</template>