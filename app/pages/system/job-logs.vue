<script setup lang="ts">
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { TomSelect } from '~/base/ui/tom-select'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { useJobLogService } from '~/services/JobLogService'
import { useServerList } from '~/composables/useServerList'
import { jobStatusVariant } from '~/utils/badge'
import LiveJobRunFeed from '~/components/features/joblogs/LiveJobRunFeed.vue'

definePageMeta({
  title: 'system.jobLogs.title',
  pageSubTitle: 'system.jobLogs.subtitle',
})

const { getAllPaginated, getDefinitions, logsCollection, definitions, loading } = useJobLogService()

const logs = computed(() => logsCollection.value.data)
const jobOptions = computed(() => definitions.value.map((d) => ({ id: d.name, name: d.name })))
const { t } = useI18n()
const statusOptions = computed(() => [
  { id: 'success', name: t('system.jobLogs.statusSuccess') },
  { id: 'failed', name: t('system.jobLogs.statusFailed') },
  // A scheduled run that never started because the previous one was still
  // going. Filterable on its own because "why did this job run half as often
  // as its schedule says" is exactly the question it answers.
  { id: 'skipped', name: t('system.jobLogs.statusSkipped') },
])
const meta = computed(() => logsCollection.value.meta)

const { filters, hasActiveFilters, reset } = useServerList({
  filters: { name: '', status: '' },
  fetch: (page, per_page, applied) => getAllPaginated({ page, per_page, ...applied }),
})

onMounted(() => getDefinitions())
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- What can appear in this table, not what has: a job that has never fired
         still shows up, which is how you tell "not registered" from "never ran".
         It carries no schedule any more — when a scheduled job runs is editable
         now, and a copy of it here would be the stale one. /system/schedules
         owns that. -->
    <Box class="col-span-12 p-5">
      <div class="mb-3 font-medium">{{ $t('system.jobLogs.registeredJobs') }}</div>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="definition in definitions"
          :key="`${definition.type}:${definition.name}`"
          class="border-foreground/10 flex items-center gap-2 rounded-xl border px-3 py-2"
        >
          <Lucide
            :icon="definition.type === 'queue' ? 'Layers' : 'Timer'"
            class="text-foreground/40 h-4 w-4"
          />
          <span class="font-medium">{{ definition.name }}</span>
          <Badge variant="secondary" look="outline">
            {{ $t(`system.jobLogs.type.${definition.type}`) }}
          </Badge>
        </div>
        <span v-if="definitions.length === 0" class="text-foreground/40 text-sm">
          {{ $t('system.jobLogs.noJobs') }}
        </span>
      </div>
    </Box>

    <Box class="col-span-12 overflow-auto p-5 lg:col-span-9 lg:overflow-visible">
      <div class="mb-4 flex justify-end">
        <FilterPopover :active="hasActiveFilters">
          <TomSelect
            v-model="filters.name"
            :options="jobOptions"
            :placeholder="$t('system.jobLogs.allJobs')"
          />

          <TomSelect
            v-model="filters.status"
            :options="statusOptions"
            :placeholder="$t('system.jobLogs.allStatuses')"
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
              <TH icon="Timer">{{ $t('system.jobLogs.columnJob') }}</TH>
              <TH icon="Activity">{{ $t('common.status') }}</TH>
              <TH icon="MessageSquare">{{ $t('system.jobLogs.columnMessage') }}</TH>
              <TH icon="Play">{{ $t('system.jobLogs.columnStarted') }}</TH>
              <TH icon="Flag">{{ $t('system.jobLogs.columnFinished') }}</TH>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(log, index) in logs" :key="log.id">
              <TD>{{ meta.from + index }}</TD>
              <TD>
                <p class="font-medium">{{ log.name }}</p>
                <SmallInfo>{{ log.type }}</SmallInfo>
              </TD>
              <TD>
                <Badge :variant="jobStatusVariant(log.status)" look="outline">
                  {{ log.status }}
                </Badge>
              </TD>
              <!-- Same as the audit path: wrap rather than widen the table. -->
              <TD class="whitespace-normal">
                <span class="text-sm break-words">{{ log.message || '—' }}</span>
              </TD>
              <TD>{{ log.started_at }}</TD>
              <!-- Null means the run never reported finishing: it panicked hard
                   or the process died mid-run. -->
              <TD>{{ log.finished_at ?? '—' }}</TD>
            </TableRow>
          </TableBody>
        </Table>
      </ServerSidePagination>
    </Box>

    <div class="col-span-12 lg:col-span-3">
      <LiveJobRunFeed />
    </div>
  </div>
</template>
