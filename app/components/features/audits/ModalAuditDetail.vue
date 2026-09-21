<script setup lang="ts">
import { DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import { Badge } from '~/base/ui/badge'
import type Audit from '~/types/entities/audit'

const isShowModal = ref(false)
const audit = ref<Audit | null>(null)

const handleModal = (isShow: boolean, payload?: Audit) => {
  isShowModal.value = isShow
  if (payload) audit.value = payload
}

// before/after/tag/additional arrive as already-parsed JSON (or null) from the
// API, so a trail with no field change renders as the empty placeholder rather
// than the literal word "null".
const pretty = (value: unknown) => {
  if (value === null || value === undefined) return null
  return JSON.stringify(value, null, 2)
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
    <DialogContent class="sm:max-w-3xl">
      <DialogTitle>{{ audit?.action }}</DialogTitle>

      <div v-if="audit" class="mt-4 flex max-h-[75vh] flex-col gap-4 overflow-auto">
        <p v-if="audit.message" class="text-foreground/70 text-sm">{{ audit.message }}</p>

        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p class="text-foreground/50 text-xs font-semibold tracking-wider uppercase">
              {{ $t('system.audits.detail.actor') }}
            </p>
            <p>
              {{ audit.actor_name || '—' }}
              <span v-if="audit.actor_email" class="text-foreground/40">
                ({{ audit.actor_email }})
              </span>
            </p>
          </div>
          <div>
            <p class="text-foreground/50 text-xs font-semibold tracking-wider uppercase">
              {{ $t('system.audits.detail.entryObject') }}
            </p>
            <p>{{ audit.entry_object_table }} #{{ audit.entry_object_id }}</p>
          </div>
          <div>
            <p class="text-foreground/50 text-xs font-semibold tracking-wider uppercase">
              {{ $t('system.audits.detail.endpoint') }}
            </p>
            <p>
              <Badge
                v-if="audit.method"
                variant="secondary"
                look="outline"
                class="mr-1 text-[10px]"
              >
                {{ audit.method }}
              </Badge>
              {{ audit.endpoint || '—' }}
            </p>
          </div>
          <div>
            <p class="text-foreground/50 text-xs font-semibold tracking-wider uppercase">
              {{ $t('common.createdAt') }}
            </p>
            <p>{{ audit.created_at }}</p>
          </div>
        </div>

        <div v-if="audit.trails.length === 0" class="text-foreground/40 text-sm">
          {{ $t('system.audits.detail.noTrails') }}
        </div>

        <div
          v-for="trail in audit.trails"
          :key="trail.id"
          class="border-foreground/10 rounded-lg border p-3"
        >
          <p class="text-foreground/50 mb-2 text-xs font-semibold tracking-wider uppercase">
            {{ trail.object_table }}
            <span v-if="trail.object_id">#{{ trail.object_id }}</span>
          </p>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-foreground/50 mb-1 text-xs font-semibold">
                {{ $t('system.audits.detail.before') }}
              </p>
              <pre
                v-if="pretty(trail.before)"
                class="border-foreground/10 bg-foreground/5 rounded-lg border p-3 text-xs break-all whitespace-pre-wrap"
                >{{ pretty(trail.before) }}</pre
              >
              <p v-else class="text-foreground/40 text-sm">{{ $t('common.empty') }}</p>
            </div>
            <div>
              <p class="text-foreground/50 mb-1 text-xs font-semibold">
                {{ $t('system.audits.detail.after') }}
              </p>
              <pre
                v-if="pretty(trail.after)"
                class="border-foreground/10 bg-foreground/5 rounded-lg border p-3 text-xs break-all whitespace-pre-wrap"
                >{{ pretty(trail.after) }}</pre
              >
              <p v-else class="text-foreground/40 text-sm">{{ $t('common.empty') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-7 flex justify-end">
        <Button variant="primary" @click="handleModal(false)">{{ $t('common.close') }}</Button>
      </div>
    </DialogContent>
  </DialogRoot>
</template>
