<script setup lang="ts">
import { DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'

// The one and only time the plaintext secret is shown: the API stores its
// bcrypt hash, so nothing can recover it after this dialog closes.
const client = ref('')
const secret = ref('')
const isShowModal = ref(false)
const copied = ref(false)

const handleModal = (isShow: boolean, payload?: { client: string; secret: string }) => {
  isShowModal.value = isShow
  copied.value = false
  if (payload) {
    client.value = payload.client
    secret.value = payload.secret
  }
}

const copy = () => {
  navigator.clipboard.writeText(secret.value).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  })
}

defineExpose({ handleModal })
</script>

<template>
  <DialogRoot
    :open="isShowModal"
    :onOpenChange="
      (d: { open: boolean }) => {
        if (!d.open) handleModal(false)
      }
    "
  >
    <DialogContent class="sm:max-w-md">
      <DialogTitle>{{ $t('system.m2mClients.secretTitle') }}</DialogTitle>

      <div class="mt-4 flex flex-col gap-4">
        <div class="bg-warning/10 text-warning flex items-start gap-2 rounded-lg p-3 text-sm">
          <Lucide icon="TriangleAlert" class="mt-0.5 h-4 w-4 shrink-0" />
          <span>{{ $t('system.m2mClients.secretWarning', { client }) }}</span>
        </div>

        <div class="flex items-center gap-2">
          <code
            class="border-foreground/10 bg-foreground/5 flex-1 truncate rounded-lg border px-3 py-2 text-xs"
          >
            {{ secret }}
          </code>
          <Button look="outline" variant="ghost" @click="copy">
            <Lucide :icon="copied ? 'Check' : 'Copy'" />
            {{ copied ? $t('common.copied') : $t('common.copy') }}
          </Button>
        </div>
      </div>

      <div class="mt-7 flex justify-end">
        <Button variant="primary" @click="handleModal(false)">{{ $t('common.close') }}</Button>
      </div>
    </DialogContent>
  </DialogRoot>
</template>
