<script setup lang="ts">
import { computed, watch } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Input } from '~/base/ui/input'
import { NativeSelect, NativeSelectOption } from '~/base/ui/native-select'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { useActivityLogService } from '~/services/ActivityLogService'
import { useLiveFeed } from '~/composables/useLiveFeed'
import { useUserService } from '~/services/UserService'
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'
import type ActivityLog from '~/types/entities/activity_log'
import { getDefaultPerPage } from '~/utils/helper'

definePageMeta({
  title: 'Audit Trail',
  pageSubTitle: 'Every request that changed something',
})

const route = useRoute()
const { getAllPaginated, logsCollection, loading } = useActivityLogService()

// Filters live in the URL alongside page/per_page, so a filtered view can be
// linked to and survives a reload.
const fetchLogs = () =>
  getAllPaginated({
    page: Number(route.query['page']) || 1,
    per_page: Number(route.query['per_page']) || getDefaultPerPage(),
    search: (route.query['search'] as string) ?? '',
    method: (route.query['method'] as string) ?? '',
    status_code: (route.query['status_code'] as string) ?? '',
    user_id: (route.query['user_id'] as string) ?? '',
    date_from: (route.query['date_from'] as string) ?? '',
    date_to: (route.query['date_to'] as string) ?? '',
  })

watch(() => route.query, fetchLogs, { immediate: true, deep: true })

const logs = computed(() => logsCollection.value.data)
const meta = computed(() => logsCollection.value.meta)

const setFilter = (key: string, value: string) => {
  const query = { ...route.query, [key]: value || undefined, page: 1 }
  navigateTo({ query })
}

/** 2xx green, 4xx amber, 5xx red - the same split ErrorHandler logs on. */
const statusVariant = (status: number) => {
  if (status >= 500) return 'danger'
  if (status >= 400) return 'warning'
  return 'success'
}

const methodVariant = (method: string) => {
  if (method === 'DELETE') return 'danger'
  if (method === 'POST') return 'success'
  return 'secondary'
}

const expanded = ref<string | null>(null)
const toggle = (id: string) => (expanded.value = expanded.value === id ? null : id)

// The user filter is gated separately by the API
// (RequirePermissionForQueryParam): sending user_id without user.index fails
// the whole request, so the picker is only offered to someone who may use it.
const { hasPermission } = useAuthStore()
const canFilterByUser = computed(() => hasPermission(Permission.UserIndex))
const { getAllPaginated: getUsers, usersCollection } = useUserService()

onMounted(() => {
  if (canFilterByUser.value) getUsers({ page: 1, per_page: 100 })
})

// Live feed. New rows are only prepended on the first page with no filters
// applied: anywhere else the row does not belong in what is on screen, and
// inserting it would show a page that contradicts its own pagination.
const isUnfilteredFirstPage = computed(
  () =>
    (Number(route.query['page']) || 1) === 1 &&
    !route.query['search'] &&
    !route.query['method'] &&
    !route.query['status_code'] &&
    !route.query['user_id'] &&
    !route.query['date_from'] &&
    !route.query['date_to'],
)

const { connected, paused } = useLiveFeed<ActivityLog>('/api/management/audits/ws', (log) => {
  if (!isUnfilteredFirstPage.value) return
  const page = logsCollection.value
  page.data = [log, ...page.data].slice(0, page.meta.per_page)
  page.meta.total += 1
})
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 overflow-auto p-5 lg:overflow-visible">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <Input
          class="w-full sm:w-64"
          type="text"
          placeholder="Search path…"
          :value="(route.query['search'] as string) ?? ''"
          @input="setFilter('search', ($event.target as HTMLInputElement).value)"
        />
        <NativeSelect
          class="w-full sm:w-40"
          :value="(route.query['method'] as string) ?? ''"
          @change="setFilter('method', ($event.target as HTMLSelectElement).value)"
        >
          <NativeSelectOption value="">All methods</NativeSelectOption>
          <NativeSelectOption value="POST">POST</NativeSelectOption>
          <NativeSelectOption value="PATCH">PATCH</NativeSelectOption>
          <NativeSelectOption value="PUT">PUT</NativeSelectOption>
          <NativeSelectOption value="DELETE">DELETE</NativeSelectOption>
        </NativeSelect>
        <Input
          class="w-full sm:w-36"
          type="number"
          placeholder="Status code"
          :value="(route.query['status_code'] as string) ?? ''"
          @change="setFilter('status_code', ($event.target as HTMLInputElement).value)"
        />
        <NativeSelect
          v-if="canFilterByUser"
          class="w-full sm:w-52"
          :value="(route.query['user_id'] as string) ?? ''"
          @change="setFilter('user_id', ($event.target as HTMLSelectElement).value)"
        >
          <NativeSelectOption value="">All users</NativeSelectOption>
          <NativeSelectOption v-for="u in usersCollection.data" :key="u.id" :value="u.id">
            {{ [u.first_name, u.last_name].filter(Boolean).join(' ') }}
          </NativeSelectOption>
        </NativeSelect>
        <Input
          class="w-full sm:w-40"
          type="date"
          title="From date"
          :value="(route.query['date_from'] as string) ?? ''"
          @change="setFilter('date_from', ($event.target as HTMLInputElement).value)"
        />
        <Input
          class="w-full sm:w-40"
          type="date"
          title="To date"
          :value="(route.query['date_to'] as string) ?? ''"
          @change="setFilter('date_to', ($event.target as HTMLInputElement).value)"
        />

        <LiveFeedToggle class="ml-auto" :connected="connected" v-model:paused="paused" />
      </div>

      <ServerSidePagination :meta="meta" :loading="loading">
        <Table class="-mt-2" variant="boxed">
          <TableHeader>
            <TableRow>
              <TH icon="Hash">No.</TH>
              <TH icon="User">User</TH>
              <TH icon="Route">Request</TH>
              <TH icon="Activity">Status</TH>
              <TH icon="Globe">IP</TH>
              <TH icon="Calendar">When</TH>
              <TH icon="Settings">Body</TH>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-for="(log, index) in logs" :key="log.id">
              <TableRow>
                <TD>{{ meta.from + index }}</TD>
                <TD>
                  <template v-if="log.user">
                    <p class="font-medium">
                      {{ [log.user.first_name, log.user.last_name].filter(Boolean).join(' ') }}
                    </p>
                    <SmallInfo>{{ log.user.email }}</SmallInfo>
                  </template>
                  <!-- Unauthenticated requests are logged too, with no user -->
                  <span v-else class="text-foreground/40 text-sm">anonymous</span>
                </TD>
                <TD>
                  <div class="flex items-center gap-2">
                    <Badge :variant="methodVariant(log.method)" look="outline">
                      {{ log.method }}
                    </Badge>
                    <span class="font-mono text-sm">{{ log.path }}</span>
                  </div>
                </TD>
                <TD>
                  <Badge :variant="statusVariant(log.status_code)">{{ log.status_code }}</Badge>
                </TD>
                <TD class="font-mono text-sm">{{ log.ip }}</TD>
                <TD>
                  <div class="flex items-center gap-1.5">
                    <Lucide icon="Calendar" class="text-foreground/40 h-3.5 w-3.5" />
                    {{ log.created_at }}
                  </div>
                </TD>
                <TD>
                  <button
                    v-if="log.request_body || log.response_body"
                    type="button"
                    class="text-primary text-sm"
                    @click="toggle(log.id)"
                  >
                    {{ expanded === log.id ? 'Hide' : 'Show' }}
                  </button>
                  <span v-else class="text-foreground/40 text-sm">&mdash;</span>
                </TD>
              </TableRow>
              <TableRow v-if="expanded === log.id">
                <TD colspan="7">
                  <div class="grid gap-4 md:grid-cols-2">
                    <div>
                      <p class="mb-1 text-xs font-medium opacity-70">Request</p>
                      <pre
                        class="bg-foreground/5 max-h-64 overflow-auto rounded-lg p-3 text-xs"
                      >{{ log.request_body ?? '—' }}</pre>
                    </div>
                    <div>
                      <p class="mb-1 text-xs font-medium opacity-70">Response</p>
                      <pre
                        class="bg-foreground/5 max-h-64 overflow-auto rounded-lg p-3 text-xs"
                      >{{ log.response_body ?? '—' }}</pre>
                    </div>
                  </div>
                  <!-- Redacted and truncated server-side; nothing to strip here. -->
                </TD>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </ServerSidePagination>
    </Box>
  </div>
</template>
