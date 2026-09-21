<script setup lang="ts">
import { Box } from '~/base/ui/box'
import { useAuditService } from '~/services/AuditService'
import { useLiveFeed } from '~/composables/useLiveFeed'
import { timeAgo } from '~/utils/helper'
import type Audit from '~/types/entities/audit'

const emit = defineEmits<{ view: [audit: Audit] }>()

const MAX_ITEMS = 15

// A service instance of its own, separate from the table's: this panel always
// shows the newest unfiltered audits rather than whatever the table's filters
// narrow it to, and never drives the table — that stays exactly as the last
// manual page or filter left it.
const { auditsCollection, loading, getAllPaginated } = useAuditService()
const audits = ref<Audit[]>([])

onMounted(async () => {
  await getAllPaginated({ page: 1, per_page: MAX_ITEMS })
  audits.value = auditsCollection.value.data
})

const { connected, paused } = useLiveFeed<Audit>('/api/management/audits/ws', (audit) => {
  audits.value = [audit, ...audits.value].slice(0, MAX_ITEMS)
})
</script>

<template>
  <Box class="h-full p-5">
    <div class="mb-3 flex items-center gap-2">
      <p class="text-sm font-semibold">{{ $t('common.liveFeed') }}</p>
      <LiveFeedToggle class="ml-auto" :connected="connected" v-model:paused="paused" />
    </div>

    <div v-if="loading && audits.length === 0" class="text-foreground/40 py-10 text-center text-sm">
      {{ $t('common.loading') }}
    </div>
    <div v-else-if="audits.length === 0" class="text-foreground/40 py-10 text-center text-sm">
      {{ $t('system.audits.liveEmpty') }}
    </div>

    <TransitionGroup
      v-else
      tag="div"
      name="live-row"
      class="flex max-h-[70vh] flex-col gap-2 overflow-y-auto"
    >
      <button
        v-for="audit in audits"
        :key="audit.id"
        type="button"
        class="border-foreground/10 hover:bg-foreground/5 w-full rounded-lg border p-2.5 text-left text-xs transition-colors"
        @click="emit('view', audit)"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="truncate font-medium">{{ audit.action }}</span>
        </div>
        <div class="text-foreground/40 mt-1.5 flex items-center justify-between">
          <span class="truncate">
            {{ audit.actor_name || $t('system.audits.anonymous') }}
            <template v-if="audit.entry_object_table">
              · {{ audit.entry_object_table }} #{{ audit.entry_object_id }}
            </template>
          </span>
          <span class="ml-2 shrink-0">{{ timeAgo(audit.created_at) }}</span>
        </div>
      </button>
    </TransitionGroup>
  </Box>
</template>

<style scoped>
.live-row-enter-active {
  transition: all 0.3s ease;
}
.live-row-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
