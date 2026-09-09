<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { useJobLogService } from '~/services/JobLogService'
import { useQueueService } from '~/services/QueueService'
import { jobStatusVariant } from '~/utils/badge'
import { formatAge, formatDuration } from '~/utils/helper'
import type { JobStatsRange } from '~/types/entities/job_log'
import JobTrendChart from '~/components/features/jobs/JobTrendChart.vue'
import StatTile from '~/components/features/jobs/StatTile.vue'

definePageMeta({
  title: 'system.jobs.title',
  pageSubTitle: 'system.jobs.subtitle',
})

// Two services, because the dashboard answers two questions that do not
// substitute for each other: how the work that already ran went (job-logs),
// and how much is waiting right now (queue). A queue can have a perfect
// success rate and still be an hour behind.
const { stats: runStats, getStats: fetchRunStats } = useJobLogService()
const { stats: queueStats, getStats: fetchQueueStats } = useQueueService()

const range = ref<JobStatsRange>('24h')
const loading = ref(false)

const ranges: JobStatsRange[] = ['24h', '7d', '30d']

const load = async () => {
  loading.value = true
  try {
    await Promise.all([fetchRunStats(range.value), fetchQueueStats()])
  } finally {
    loading.value = false
  }
}

watch(range, load)
onMounted(load)

const summary = computed(() => runStats.value?.summary)
const successRate = computed(() =>
  summary.value ? `${summary.value.success_rate.toFixed(1)}%` : '—',
)

// Green only once there is something to be green about: a window with no runs
// at all reports 0%, and painting that red would flag a quiet night as an
// outage.
const successRateVariant = computed(() => {
  if (!summary.value || summary.value.total === 0) return 'secondary'
  if (summary.value.success_rate >= 99) return 'success'
  if (summary.value.success_rate >= 90) return 'warning'
  return 'danger'
})

const backlogVariant = computed(() => {
  const age = queueStats.value?.oldest_pending_seconds
  if (age === null || age === undefined) return 'secondary'
  if (age > 300) return 'danger'
  if (age > 60) return 'warning'
  return 'success'
})
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Runs: what already happened, over the selected window. -->
    <div class="col-span-12 flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm font-medium opacity-70">
        {{ $t('system.jobs.runsHeading') }}
      </p>
      <div class="flex items-center gap-2">
        <div class="border-foreground/10 flex overflow-hidden rounded-lg border">
          <button
            v-for="option in ranges"
            :key="option"
            type="button"
            class="hover:bg-foreground/5 px-3 py-1.5 text-sm"
            :class="range === option ? 'bg-primary text-white hover:bg-primary' : ''"
            @click="range = option"
          >
            {{ $t(`system.jobs.range.${option}`) }}
          </button>
        </div>
        <Button look="outline" :disabled="loading" @click="load">
          <Lucide icon="RefreshCw" />
          {{ $t('common.refresh') }}
        </Button>
      </div>
    </div>

    <StatTile
      class="col-span-6 xl:col-span-3"
      icon="Activity"
      :label="$t('system.jobs.totalRuns')"
      :value="summary ? String(summary.total) : '—'"
    />
    <StatTile
      class="col-span-6 xl:col-span-3"
      icon="CircleCheck"
      :label="$t('system.jobs.successRate')"
      :value="successRate"
      :variant="successRateVariant"
      :hint="summary ? $t('system.jobs.successRateHint', { skipped: summary.skipped }) : ''"
    />
    <StatTile
      class="col-span-6 xl:col-span-3"
      icon="CircleX"
      :label="$t('system.jobs.failedRuns')"
      :value="summary ? String(summary.failed) : '—'"
      :variant="summary && summary.failed > 0 ? 'danger' : 'secondary'"
    />
    <StatTile
      class="col-span-6 xl:col-span-3"
      icon="Timer"
      :label="$t('system.jobs.avgDuration')"
      :value="formatDuration(summary?.avg_duration_ms)"
      :hint="
        summary
          ? $t('system.jobs.slowestHint', { value: formatDuration(summary.max_duration_ms) })
          : ''
      "
    />

    <!-- Queue: what is waiting right now. Separate heading because it is a
         different question, not a different cut of the same numbers. -->
    <div class="col-span-12 -mb-2">
      <p class="text-sm font-medium opacity-70">{{ $t('system.jobs.queueHeading') }}</p>
    </div>

    <StatTile
      class="col-span-6 xl:col-span-3"
      icon="Hourglass"
      :label="$t('system.jobs.pending')"
      :value="queueStats ? String(queueStats.pending) : '—'"
      :hint="
        queueStats && queueStats.delayed > 0
          ? $t('system.jobs.delayedHint', { count: queueStats.delayed })
          : ''
      "
    />
    <StatTile
      class="col-span-6 xl:col-span-3"
      icon="Play"
      :label="$t('system.jobs.running')"
      :value="queueStats ? String(queueStats.running) : '—'"
      :variant="queueStats && queueStats.running > 0 ? 'primary' : 'secondary'"
    />
    <StatTile
      class="col-span-6 xl:col-span-3"
      icon="TriangleAlert"
      :label="$t('system.jobs.queueFailed')"
      :value="queueStats ? String(queueStats.failed) : '—'"
      :variant="queueStats && queueStats.failed > 0 ? 'danger' : 'secondary'"
    />
    <!-- The number that actually says whether workers are keeping up: it climbs
         the moment they stop, however many jobs are in the table. -->
    <StatTile
      class="col-span-6 xl:col-span-3"
      icon="Clock"
      :label="$t('system.jobs.backlogAge')"
      :value="formatAge(queueStats?.oldest_pending_seconds)"
      :variant="backlogVariant"
      :hint="$t('system.jobs.backlogHint')"
    />

    <Box class="col-span-12 p-5 xl:col-span-8">
      <div class="mb-4 flex items-center justify-between gap-3">
        <p class="font-medium">{{ $t('system.jobs.trendTitle') }}</p>
        <div class="flex items-center gap-3 text-xs opacity-70">
          <span class="flex items-center gap-1.5">
            <span class="bg-success h-2 w-2 rounded-full" />{{ $t('system.jobs.legendSuccess') }}
          </span>
          <span class="flex items-center gap-1.5">
            <span class="bg-danger h-2 w-2 rounded-full" />{{ $t('system.jobs.legendFailed') }}
          </span>
          <span class="flex items-center gap-1.5">
            <span class="bg-warning h-2 w-2 rounded-full" />{{ $t('system.jobs.legendSkipped') }}
          </span>
        </div>
      </div>
      <JobTrendChart :points="runStats?.trend ?? []" />
    </Box>

    <!-- Queue depth per job: which handler the backlog is actually made of. -->
    <Box class="col-span-12 p-5 xl:col-span-4">
      <p class="mb-4 font-medium">{{ $t('system.jobs.queueByJob') }}</p>
      <div
        v-if="!queueStats || queueStats.by_name.length === 0"
        class="py-8 text-center text-sm opacity-40"
      >
        {{ $t('system.jobs.queueEmpty') }}
      </div>
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="row in queueStats.by_name"
          :key="row.name"
          class="border-foreground/10 rounded-lg border p-3"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="truncate text-sm font-medium">{{ row.name }}</span>
            <Badge v-if="row.failed > 0" variant="danger" look="outline" class="shrink-0">
              {{ $t('system.jobs.failedCount', { count: row.failed }) }}
            </Badge>
          </div>
          <div class="mt-1.5 flex gap-3 text-xs opacity-60">
            <span>{{ $t('system.jobs.pending') }}: {{ row.pending }}</span>
            <span>{{ $t('system.jobs.running') }}: {{ row.running }}</span>
            <span>{{ $t('system.jobs.legendSuccess') }}: {{ row.success }}</span>
          </div>
        </div>
      </div>
    </Box>

    <!-- Worst first, from the API: the reason to read this table is to find
         what is breaking, not to read an alphabetical list. -->
    <Box class="col-span-12 overflow-auto p-5 lg:overflow-visible">
      <p class="mb-4 font-medium">{{ $t('system.jobs.perJobTitle') }}</p>
      <Table class="-mt-2" variant="boxed">
        <TableHeader>
          <TableRow>
            <TH icon="Timer">{{ $t('system.jobLogs.columnJob') }}</TH>
            <TH icon="Hash">{{ $t('system.jobs.columnRuns') }}</TH>
            <TH icon="CircleX">{{ $t('system.jobs.columnFailed') }}</TH>
            <TH icon="Gauge">{{ $t('system.jobs.columnAvg') }}</TH>
            <TH icon="ChevronsUp">{{ $t('system.jobs.columnMax') }}</TH>
            <TH icon="Clock">{{ $t('system.jobs.columnLastRun') }}</TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in runStats?.by_job ?? []" :key="`${row.type}:${row.name}`">
            <TD>
              <p class="font-medium">{{ row.name }}</p>
              <SmallInfo>{{ row.type }}</SmallInfo>
            </TD>
            <TD>
              {{ row.total }}
              <SmallInfo v-if="row.skipped > 0">
                {{ $t('system.jobs.skippedCount', { count: row.skipped }) }}
              </SmallInfo>
            </TD>
            <TD>
              <Badge :variant="row.failed > 0 ? 'danger' : 'secondary'" look="outline">
                {{ row.failed }}
              </Badge>
            </TD>
            <TD>{{ formatDuration(row.avg_duration_ms) }}</TD>
            <TD>{{ formatDuration(row.max_duration_ms) }}</TD>
            <TD>
              <div class="flex items-center gap-2">
                <Badge
                  v-if="row.last_status"
                  :variant="jobStatusVariant(row.last_status)"
                  look="outline"
                >
                  {{ row.last_status }}
                </Badge>
                <span class="text-sm opacity-70">{{ row.f_last_run_at ?? '—' }}</span>
              </div>
            </TD>
          </TableRow>
        </TableBody>
      </Table>

      <EmptyData v-if="!loading && (runStats?.by_job.length ?? 0) === 0" />
    </Box>
  </div>
</template>
