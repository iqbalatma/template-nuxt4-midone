<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue'
import type { ModalDelete } from '#components'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { TomSelect } from '~/base/ui/tom-select'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { useQueueService } from '~/services/QueueService'
import { useServerList } from '~/composables/useServerList'
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'
import { queueStatusVariant } from '~/utils/badge'
import { formatDuration } from '~/utils/helper'
import type QueueJob from '~/types/entities/queue_job'
import LiveQueueFeed from '~/components/features/queue/LiveQueueFeed.vue'

definePageMeta({
  title: 'system.queue.title',
  pageSubTitle: 'system.queue.subtitle',
})

const {
  jobsCollection,
  stats,
  loading,
  actingId,
  getAllPaginated,
  getStats,
  retry,
  cancel,
  retryFailed,
  purge,
} = useQueueService()
const { hasPermission } = useAuthStore()
const { t } = useI18n()

// Reading the board and acting on it are separate permissions: a retry re-runs
// whatever the job does, so a read-only operator gets the list without the
// buttons that re-send the email.
const canManage = computed(() => hasPermission(Permission.QueueManage))

const jobs = computed(() => jobsCollection.value.data)
const meta = computed(() => jobsCollection.value.meta)

// The job filter is fed from the registry, not the rows: a handler that has
// never been dispatched is still selectable, and its empty list is a real
// answer rather than a missing option.
const nameOptions = computed(() =>
  (stats.value?.handlers ?? []).map((name) => ({ id: name, name })),
)
const queueOptions = computed(() => (stats.value?.queues ?? []).map((name) => ({ id: name, name })))
const statusOptions = computed(() =>
  (['pending', 'running', 'success', 'failed', 'canceled'] as const).map((status) => ({
    id: status,
    name: t(`system.queue.status.${status}`),
  })),
)

const { filters, hasActiveFilters, reset, refresh } = useServerList({
  filters: { queue: '', name: '', status: '' },
  fetch: (page, per_page, applied) => getAllPaginated({ page, per_page, ...applied }),
})

// Both, after every action: the table shows the rows, the tiles show the depth,
// and an action changes both. Refreshing one would leave the other contradicting it.
const reload = async () => {
  await Promise.all([refresh(), getStats()])
}

onMounted(getStats)

const onRetry = async (job: QueueJob) => {
  if (await retry(job.id)) await reload()
}

const onCancel = async (job: QueueJob) => {
  if (await cancel(job.id)) await reload()
}

const retryAllRef = useTemplateRef<InstanceType<typeof ModalDelete> | null>('retryAllRef')
const purgeRef = useTemplateRef<InstanceType<typeof ModalDelete> | null>('purgeRef')

const onRetryAllFailed = async () => {
  if (await retryFailed()) await reload()
}

// Successful and canceled rows only. Failed ones are the list somebody has to
// act on, and a "clear finished" button that quietly took them too would delete
// the only record of what went wrong.
const onPurgeFinished = async () => {
  if (await purge(['success', 'canceled'])) await reload()
}

const isActing = (job: QueueJob) => actingId.value === job.id
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 overflow-auto p-5 lg:col-span-9 lg:overflow-visible">
      <!-- Actions left, filters right: the row still reads correctly when the
           left side is missing because the reader has no manage permission. -->
      <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div class="flex flex-wrap gap-2">
          <Button
            v-if="canManage"
            look="outline"
            :disabled="loading || (stats?.failed ?? 0) === 0"
            @click="retryAllRef?.handleModal(true)"
          >
            <Lucide icon="RotateCcw" />
            {{ $t('system.queue.retryAllFailed', { count: stats?.failed ?? 0 }) }}
          </Button>
          <Button
            v-if="canManage"
            look="outline"
            variant="ghost"
            :disabled="loading"
            @click="purgeRef?.handleModal(true)"
          >
            <Lucide icon="Trash2" />
            {{ $t('system.queue.purgeFinished') }}
          </Button>
          <Button look="outline" variant="ghost" :disabled="loading" @click="reload">
            <Lucide icon="RefreshCw" />
            {{ $t('common.refresh') }}
          </Button>
        </div>

        <FilterPopover :active="hasActiveFilters">
          <TomSelect
            v-model="filters.name"
            :options="nameOptions"
            :placeholder="$t('system.queue.allJobs')"
          />
          <TomSelect
            v-model="filters.status"
            :options="statusOptions"
            :placeholder="$t('system.queue.allStatuses')"
          />
          <TomSelect
            v-model="filters.queue"
            :options="queueOptions"
            :placeholder="$t('system.queue.allQueues')"
          />

          <template #footer>
            <Button
              look="outline"
              variant="ghost"
              size="sm"
              :disabled="!hasActiveFilters"
              @click="reset"
            >
              <Lucide class="mr-1.5 size-4" icon="X" />
              {{ $t('common.reset') }}
            </Button>
          </template>
        </FilterPopover>
      </div>

      <ServerSidePagination :meta="meta" :loading="loading">
        <Table class="-mt-2" variant="boxed">
          <TableHeader>
            <TableRow>
              <TH icon="Hash">{{ $t('common.no') }}</TH>
              <TH icon="Layers">{{ $t('system.jobLogs.columnJob') }}</TH>
              <TH icon="Activity">{{ $t('common.status') }}</TH>
              <TH icon="MessageSquare">{{ $t('system.queue.columnDetail') }}</TH>
              <TH icon="Clock">{{ $t('system.queue.columnDispatched') }}</TH>
              <TH v-if="canManage" icon="Settings">{{ $t('common.actions') }}</TH>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(job, index) in jobs" :key="job.id">
              <TD>{{ meta.from + index }}</TD>
              <TD>
                <p class="font-medium">{{ job.name }}</p>
                <SmallInfo>{{ job.queue }}</SmallInfo>
              </TD>
              <TD>
                <Badge :variant="queueStatusVariant(job.status)" look="outline">
                  {{ $t(`system.queue.status.${job.status}`) }}
                </Badge>
                <SmallInfo>{{ job.attempts }}/{{ job.max_attempts }}</SmallInfo>
              </TD>
              <!-- Same rule as the audit path: wrap rather than widen the whole
                   table into a horizontal scroll. -->
              <TD class="whitespace-normal">
                <span v-if="job.last_error" class="text-danger text-sm break-words">
                  {{ job.last_error }}
                </span>
                <span v-else class="text-sm opacity-50">
                  {{ formatDuration(job.duration_ms) }}
                </span>
              </TD>
              <TD>
                {{ job.f_created_at }}
                <!-- A pending job held in the future is waiting on backoff or a
                     delay, not on a worker. Saying so here is the difference
                     between "stuck" and "scheduled". -->
                <SmallInfo v-if="job.status === 'pending' && job.available_at > job.created_at">
                  {{ $t('system.queue.availableAt', { time: job.f_available_at }) }}
                </SmallInfo>
              </TD>
              <TD v-if="canManage">
                <div class="flex gap-2">
                  <Button
                    v-if="['success', 'failed', 'canceled'].includes(job.status)"
                    size="sm"
                    look="outline"
                    :disabled="isActing(job)"
                    @click="onRetry(job)"
                  >
                    {{ $t('system.queue.retry') }}
                  </Button>
                  <Button
                    v-if="job.status === 'pending'"
                    size="sm"
                    look="outline"
                    variant="ghost"
                    :disabled="isActing(job)"
                    @click="onCancel(job)"
                  >
                    {{ $t('system.queue.cancel') }}
                  </Button>
                </div>
              </TD>
            </TableRow>
          </TableBody>
        </Table>

        <EmptyData v-if="!loading && jobs.length === 0" />
      </ServerSidePagination>
    </Box>

    <div class="col-span-12 lg:col-span-3">
      <LiveQueueFeed />
    </div>

    <ModalDelete
      ref="retryAllRef"
      :title="$t('system.queue.retryAllTitle')"
      :message="$t('system.queue.retryAllMessage', { count: stats?.failed ?? 0 })"
      @submit="onRetryAllFailed"
    />
    <ModalDelete
      ref="purgeRef"
      :title="$t('system.queue.purgeTitle')"
      :message="$t('system.queue.purgeMessage')"
      @submit="onPurgeFinished"
    />
  </div>
</template>
