<script setup lang="ts">
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { useActivityLogService } from '~/services/ActivityLogService'
import { useLiveFeed } from '~/composables/useLiveFeed'
import { timeAgo } from '~/utils/helper'
import { httpMethodVariant, httpStatusVariant } from '~/utils/badge'
import type ActivityLog from '~/types/entities/activity_log'

const emit = defineEmits<{ view: [log: ActivityLog] }>()

const MAX_ITEMS = 15

// A service instance of its own, separate from the table's: this panel always
// shows the newest unfiltered activity rather than whatever the table's filters
// narrow it to. Fetched once on mount so the panel is not empty until the first
// frame arrives.
const { logsCollection, loading, getAllPaginated } = useActivityLogService()
const logs = ref<ActivityLog[]>([])

onMounted(async () => {
  await getAllPaginated({ page: 1, per_page: MAX_ITEMS })
  logs.value = logsCollection.value.data
})

const { connected, paused } = useLiveFeed<ActivityLog>('/api/management/audits/ws', (log) => {
  logs.value = [log, ...logs.value].slice(0, MAX_ITEMS)
})
</script>

<template>
  <Box class="h-full p-5">
    <div class="mb-3 flex items-center gap-2">
      <p class="text-sm font-semibold">{{ $t('common.liveFeed') }}</p>
      <LiveFeedToggle class="ml-auto" :connected="connected" v-model:paused="paused" />
    </div>

    <div v-if="loading && logs.length === 0" class="text-foreground/40 py-10 text-center text-sm">
      {{ $t('common.loading') }}
    </div>
    <div v-else-if="logs.length === 0" class="text-foreground/40 py-10 text-center text-sm">
      {{ $t('system.audits.liveEmpty') }}
    </div>

    <TransitionGroup
      v-else
      tag="div"
      name="live-row"
      class="flex max-h-[70vh] flex-col gap-2 overflow-y-auto"
    >
      <button
        v-for="log in logs"
        :key="log.id"
        type="button"
        class="border-foreground/10 hover:bg-foreground/5 w-full rounded-lg border p-2.5 text-left text-xs transition-colors"
        @click="emit('view', log)"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex min-w-0 items-center gap-1.5">
            <Badge
              :variant="httpMethodVariant(log.method)"
              look="outline"
              class="shrink-0 text-[10px]"
            >
              {{ log.method }}
            </Badge>
            <span class="truncate font-medium">{{ log.path }}</span>
          </div>
          <Badge
            :variant="httpStatusVariant(log.status_code)"
            look="outline"
            class="shrink-0 text-[10px]"
          >
            {{ log.status_code }}
          </Badge>
        </div>
        <div class="text-foreground/40 mt-1.5 flex items-center justify-between">
          <span>
            {{
              log.user
                ? [log.user.first_name, log.user.last_name].filter(Boolean).join(' ')
                : $t('system.audits.anonymous')
            }}
          </span>
          <span>{{ timeAgo(log.created_at) }}</span>
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
