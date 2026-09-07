<script setup lang="ts">
import { DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import type ActivityLog from '~/types/entities/activity_log'

const isShowModal = ref(false)
const log = ref<ActivityLog | null>(null)

const handleModal = (isShow: boolean, payload?: ActivityLog) => {
  isShowModal.value = isShow
  if (payload) log.value = payload
}

// Bodies are stored pre-redacted and possibly truncated (SanitizeBody in the
// Go API), so a truncated one may not parse — fall back to the raw string
// rather than showing nothing.
const pretty = (raw: string | null) => {
  if (!raw) return null
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
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
    <DialogContent class="sm:max-w-2xl">
      <DialogTitle>
        <span class="font-mono">{{ log?.method }} {{ log?.path }}</span>
      </DialogTitle>

      <div v-if="log" class="mt-4 flex max-h-[70vh] flex-col gap-4 overflow-auto">
        <div>
          <p class="text-foreground/50 mb-1 text-xs font-semibold tracking-wider uppercase">
            {{ $t('system.audits.detail.request') }}
          </p>
          <pre
            v-if="pretty(log.request_body)"
            class="border-foreground/10 bg-foreground/5 rounded-lg border p-3 text-xs break-all whitespace-pre-wrap"
            >{{ pretty(log.request_body) }}</pre
          >
          <p v-else class="text-foreground/40 text-sm">{{ $t('common.empty') }}</p>
        </div>

        <div>
          <p class="text-foreground/50 mb-1 text-xs font-semibold tracking-wider uppercase">
            {{ $t('system.audits.detail.response') }}
          </p>
          <pre
            v-if="pretty(log.response_body)"
            class="border-foreground/10 bg-foreground/5 rounded-lg border p-3 text-xs break-all whitespace-pre-wrap"
            >{{ pretty(log.response_body) }}</pre
          >
          <p v-else class="text-foreground/40 text-sm">{{ $t('common.empty') }}</p>
        </div>
      </div>

      <div class="mt-7 flex justify-end">
        <Button variant="primary" @click="handleModal(false)">{{ $t('common.close') }}</Button>
      </div>
    </DialogContent>
  </DialogRoot>
</template>
