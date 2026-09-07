<script setup lang="ts">
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { useJobLogService } from '~/services/JobLogService'
import { useLiveFeed } from '~/composables/useLiveFeed'
import { timeAgo } from '~/utils/helper'
import { jobStatusVariant } from '~/utils/badge'
import type JobLog from '~/types/entities/job_log'

const MAX_ITEMS = 15

// Its own service instance, like the audit panel: the newest runs whatever the
// table is filtered to.
const { logsCollection, loading, getAllPaginated } = useJobLogService()
const logs = ref<JobLog[]>([])

onMounted(async () => {
  await getAllPaginated({ page: 1, per_page: MAX_ITEMS })
  logs.value = logsCollection.value.data
})

const { connected, paused } = useLiveFeed<JobLog>('/api/management/job-logs/ws', (log) => {
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
      {{ $t('system.jobLogs.liveEmpty') }}
    </div>

    <TransitionGroup
      v-else
      tag="div"
      name="live-row"
      class="flex max-h-[70vh] flex-col gap-2 overflow-y-auto"
    >
      <div
        v-for="log in logs"
        :key="log.id"
        class="border-foreground/10 rounded-lg border p-2.5 text-xs"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="truncate font-medium">{{ log.name }}</span>
          <Badge
            :variant="jobStatusVariant(log.status)"
            look="outline"
            class="shrink-0 text-[10px]"
          >
            {{ log.status }}
          </Badge>
        </div>
        <div class="text-foreground/40 mt-1.5 flex items-center justify-between gap-2">
          <span class="truncate">{{ log.message || log.type }}</span>
          <span class="shrink-0">{{ timeAgo(log.started_at) }}</span>
        </div>
      </div>
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
