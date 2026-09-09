<script setup lang="ts">
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { useQueueService } from '~/services/QueueService'
import { useLiveFeed } from '~/composables/useLiveFeed'
import { queueStatusVariant } from '~/utils/badge'
import { timeAgo } from '~/utils/helper'
import type QueueJob from '~/types/entities/queue_job'

const MAX_ITEMS = 15

// Its own service instance, like the audit and job-run panels: always the
// newest rows, whatever the table next to it is filtered to.
const { jobsCollection, loading, getAllPaginated } = useQueueService()
const jobs = ref<QueueJob[]>([])

onMounted(async () => {
  await getAllPaginated({ page: 1, per_page: MAX_ITEMS })
  jobs.value = jobsCollection.value.data
})

/**
 * This feed carries every *transition*, not just finished runs — a job is
 * pushed when it is dispatched, when a worker claims it and when it settles.
 * So a frame is usually an update to a row already on screen, and appending
 * blindly would show the same job three times.
 */
const { connected, paused } = useLiveFeed<QueueJob>('/api/management/queue/ws', (job) => {
  const existing = jobs.value.findIndex((row) => row.id === job.id)
  if (existing >= 0) {
    jobs.value.splice(existing, 1)
  }
  jobs.value = [job, ...jobs.value].slice(0, MAX_ITEMS)
})
</script>

<template>
  <Box class="h-full p-5">
    <div class="mb-3 flex items-center gap-2">
      <p class="text-sm font-semibold">{{ $t('common.liveFeed') }}</p>
      <LiveFeedToggle class="ml-auto" :connected="connected" v-model:paused="paused" />
    </div>

    <div v-if="loading && jobs.length === 0" class="text-foreground/40 py-10 text-center text-sm">
      {{ $t('common.loading') }}
    </div>
    <div v-else-if="jobs.length === 0" class="text-foreground/40 py-10 text-center text-sm">
      {{ $t('system.queue.liveEmpty') }}
    </div>

    <TransitionGroup
      v-else
      tag="div"
      name="live-row"
      class="flex max-h-[70vh] flex-col gap-2 overflow-y-auto"
    >
      <div
        v-for="job in jobs"
        :key="job.id"
        class="border-foreground/10 rounded-lg border p-2.5 text-xs"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="truncate font-medium">{{ job.name }}</span>
          <Badge
            :variant="queueStatusVariant(job.status)"
            look="outline"
            class="shrink-0 text-[10px]"
          >
            {{ $t(`system.queue.status.${job.status}`) }}
          </Badge>
        </div>
        <div class="text-foreground/40 mt-1.5 flex items-center justify-between gap-2">
          <span class="truncate">{{ job.last_error || job.queue }}</span>
          <span class="shrink-0">{{ timeAgo(job.created_at) }}</span>
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
