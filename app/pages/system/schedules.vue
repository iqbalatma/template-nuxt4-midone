<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { useScheduleService } from '~/services/ScheduleService'
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'
import { jobStatusVariant } from '~/utils/badge'
import { formatDuration } from '~/utils/helper'
import type ScheduledJob from '~/types/entities/scheduled_job'
import type { JobStatus } from '~/types/entities/job_log'
import ModalFormSchedule from '~/components/features/schedules/ModalFormSchedule.vue'

definePageMeta({
  title: 'system.schedules.title',
  pageSubTitle: 'system.schedules.subtitle',
})

const { schedules, loading, actingId, getAll, update, runNow } = useScheduleService()
const { hasPermission } = useAuthStore()

// Same split as the queue board: reading which jobs are scheduled is a smaller
// capability than changing when they run or triggering one by hand.
const canManage = computed(() => hasPermission(Permission.ScheduleManage))

const modalFormRef = useTemplateRef<InstanceType<typeof ModalFormSchedule> | null>('modalFormRef')

onMounted(getAll)

const onToggle = async (schedule: ScheduledJob) => {
  const saved = await update(schedule.id, {
    cron_expression: schedule.cron_expression,
    enabled: !schedule.enabled,
  })
  if (saved) await getAll()
}

/**
 * Answers "accepted", not "finished" — the API hands the job to the scheduler's
 * own goroutine. The outcome lands on the Job Runs screen a moment later, so
 * this refetches rather than expecting a result in the response.
 */
const onRunNow = async (schedule: ScheduledJob) => {
  if (await runNow(schedule.id)) {
    setTimeout(getAll, 1000)
  }
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 p-5">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm opacity-70">{{ $t('system.schedules.notice') }}</p>
        <Button look="outline" :disabled="loading" @click="getAll">
          <Lucide icon="RefreshCw" />
          {{ $t('common.refresh') }}
        </Button>
      </div>

      <Table class="-mt-2" variant="boxed">
        <TableHeader>
          <TableRow>
            <TH icon="Timer">{{ $t('system.jobLogs.columnJob') }}</TH>
            <TH icon="Clock">{{ $t('system.schedules.columnCron') }}</TH>
            <TH icon="CalendarClock">{{ $t('system.schedules.columnNextRun') }}</TH>
            <TH icon="History">{{ $t('system.schedules.columnLastRun') }}</TH>
            <TH v-if="canManage" icon="Settings">{{ $t('common.actions') }}</TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="schedule in schedules" :key="schedule.id">
            <TD>
              <p class="font-medium">{{ schedule.name }}</p>
              <Badge
                :variant="schedule.enabled ? 'success' : 'secondary'"
                look="outline"
                class="mt-1"
              >
                {{
                  schedule.enabled
                    ? $t('system.schedules.enabled')
                    : $t('system.schedules.disabled')
                }}
              </Badge>
            </TD>
            <TD class="font-mono text-sm">{{ schedule.cron_expression }}</TD>
            <TD class="whitespace-normal">
              <!-- Three different reasons for "no next run", and they are not
                   interchangeable: a broken expression is a bug to fix, a
                   disabled job is a choice, and a valid expression that can
                   never fire (31 February) is neither. -->
              <span v-if="schedule.cron_error" class="text-danger text-sm break-words">
                {{ schedule.cron_error }}
              </span>
              <span v-else-if="!schedule.enabled" class="text-sm opacity-40">
                {{ $t('system.schedules.notScheduled') }}
              </span>
              <span v-else-if="schedule.f_next_run_at">{{ schedule.f_next_run_at }}</span>
              <span v-else class="text-sm opacity-40">{{ $t('system.schedules.never') }}</span>
            </TD>
            <TD class="whitespace-normal">
              <div v-if="schedule.last_run_at" class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                  <Badge
                    v-if="schedule.last_status"
                    :variant="jobStatusVariant(schedule.last_status as JobStatus)"
                    look="outline"
                  >
                    {{ schedule.last_status }}
                  </Badge>
                  <span class="text-sm">{{ schedule.f_last_run_at }}</span>
                  <SmallInfo>{{ formatDuration(schedule.last_duration_ms) }}</SmallInfo>
                </div>
                <span v-if="schedule.last_message" class="text-xs break-words opacity-60">
                  {{ schedule.last_message }}
                </span>
              </div>
              <span v-else class="text-sm opacity-40">{{ $t('system.schedules.neverRan') }}</span>
            </TD>
            <TD v-if="canManage">
              <div class="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  look="outline"
                  :disabled="actingId === schedule.id"
                  @click="modalFormRef?.handleModal(true, schedule)"
                >
                  {{ $t('common.edit') }}
                </Button>
                <Button
                  size="sm"
                  look="outline"
                  variant="ghost"
                  :disabled="actingId === schedule.id"
                  @click="onToggle(schedule)"
                >
                  {{
                    schedule.enabled
                      ? $t('system.schedules.disable')
                      : $t('system.schedules.enable')
                  }}
                </Button>
                <!-- Runs even when disabled: "disabled" means the clock does not
                     start it, not that an operator may not — and running it once
                     by hand is how you check it is safe to enable. -->
                <Button
                  size="sm"
                  look="outline"
                  variant="ghost"
                  :disabled="actingId === schedule.id"
                  @click="onRunNow(schedule)"
                >
                  <Lucide icon="Play" class="size-3.5" />
                  {{ $t('system.schedules.runNow') }}
                </Button>
              </div>
            </TD>
          </TableRow>
        </TableBody>
      </Table>

      <!-- A job only appears here because Go code registers it, so an empty
           list means nothing is scheduled at all — not that a filter is on. -->
      <EmptyData v-if="!loading && schedules.length === 0" />
    </Box>

    <ModalFormSchedule ref="modalFormRef" @submit="getAll" />
  </div>
</template>
