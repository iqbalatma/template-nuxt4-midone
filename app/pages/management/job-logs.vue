<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { NativeSelect, NativeSelectOption } from '~/base/ui/native-select'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { useJobLogService } from '~/services/JobLogService'
import { useLiveFeed } from '~/composables/useLiveFeed'
import type JobLog from '~/types/entities/job_log'
import { getDefaultPerPage } from '~/utils/helper'

definePageMeta({
  title: 'Job Runs',
  pageSubTitle: 'History of scheduled background work',
})

const route = useRoute()
const { getAllPaginated, getDefinitions, logsCollection, definitions, loading } = useJobLogService()

const fetchLogs = () =>
  getAllPaginated({
    page: Number(route.query['page']) || 1,
    per_page: Number(route.query['per_page']) || getDefaultPerPage(),
    name: (route.query['name'] as string) ?? '',
    status: (route.query['status'] as string) ?? '',
  })

watch(() => route.query, fetchLogs, { immediate: true, deep: true })
onMounted(() => getDefinitions())

const logs = computed(() => logsCollection.value.data)
const meta = computed(() => logsCollection.value.meta)

const setFilter = (key: string, value: string) => {
  navigateTo({ query: { ...route.query, [key]: value || undefined, page: 1 } })
}

// Same rule as the audit trail: a new run is only prepended on the unfiltered
// first page, where it actually belongs in what is on screen.
const isUnfilteredFirstPage = computed(
  () =>
    (Number(route.query['page']) || 1) === 1 && !route.query['name'] && !route.query['status'],
)

const { connected, paused } = useLiveFeed<JobLog>('/api/management/job-logs/ws', (log) => {
  if (!isUnfilteredFirstPage.value) return
  const page = logsCollection.value
  page.data = [log, ...page.data].slice(0, page.meta.per_page)
  page.meta.total += 1
})
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- The registered jobs, not their runs: a job that has never fired still
         shows up here, which is how you tell "not scheduled" from "never ran". -->
    <Box class="col-span-12 p-5">
      <div class="mb-3 font-medium">Registered jobs</div>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="definition in definitions"
          :key="definition.name"
          class="border-foreground/10 flex items-center gap-2 rounded-xl border px-3 py-2"
        >
          <Lucide icon="Timer" class="text-foreground/40 h-4 w-4" />
          <span class="font-medium">{{ definition.name }}</span>
          <Badge variant="secondary" look="outline">every {{ definition.interval }}</Badge>
        </div>
        <span v-if="definitions.length === 0" class="text-foreground/40 text-sm">
          No jobs registered.
        </span>
      </div>
    </Box>

    <Box class="col-span-12 overflow-auto p-5 lg:overflow-visible">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <NativeSelect
          class="w-full sm:w-52"
          :value="(route.query['name'] as string) ?? ''"
          @change="setFilter('name', ($event.target as HTMLSelectElement).value)"
        >
          <NativeSelectOption value="">All jobs</NativeSelectOption>
          <NativeSelectOption v-for="d in definitions" :key="d.name" :value="d.name">
            {{ d.name }}
          </NativeSelectOption>
        </NativeSelect>
        <NativeSelect
          class="w-full sm:w-40"
          :value="(route.query['status'] as string) ?? ''"
          @change="setFilter('status', ($event.target as HTMLSelectElement).value)"
        >
          <NativeSelectOption value="">All statuses</NativeSelectOption>
          <NativeSelectOption value="success">Success</NativeSelectOption>
          <NativeSelectOption value="failed">Failed</NativeSelectOption>
        </NativeSelect>

        <LiveFeedToggle class="ml-auto" :connected="connected" v-model:paused="paused" />
      </div>

      <ServerSidePagination :meta="meta" :loading="loading">
        <Table class="-mt-2" variant="boxed">
          <TableHeader>
            <TableRow>
              <TH icon="Hash">No.</TH>
              <TH icon="Timer">Job</TH>
              <TH icon="Activity">Status</TH>
              <TH icon="MessageSquare">Message</TH>
              <TH icon="Play">Started</TH>
              <TH icon="Flag">Finished</TH>
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
                <Badge :variant="log.status === 'failed' ? 'danger' : 'success'">
                  {{ log.status }}
                </Badge>
              </TD>
              <TD>
                <span class="text-sm">{{ log.message || '—' }}</span>
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
  </div>
</template>
