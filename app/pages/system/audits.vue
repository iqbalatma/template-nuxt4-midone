<script setup lang="ts">
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Input } from '~/base/ui/input'
import { TomSelect } from '~/base/ui/tom-select'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { useActivityLogService } from '~/services/ActivityLogService'
import { useUserService } from '~/services/UserService'
import { useServerList } from '~/composables/useServerList'
import { httpMethodVariant, httpStatusVariant } from '~/utils/badge'
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'
import ModalActivityLogDetail from '~/components/features/audits/ModalActivityLogDetail.vue'
import LiveActivityFeed from '~/components/features/audits/LiveActivityFeed.vue'
import type ActivityLog from '~/types/entities/activity_log'

definePageMeta({
  title: 'system.audits.title',
  pageSubTitle: 'system.audits.subtitle',
})

const { getAllPaginated, logsCollection, loading } = useActivityLogService()

const logs = computed(() => logsCollection.value.data)
const meta = computed(() => logsCollection.value.meta)

const { filters, hasActiveFilters, reset } = useServerList({
  filters: { search: '', method: '', status_code: '', user_id: '', date_from: '', date_to: '' },
  debounce: ['search', 'status_code'],
  fetch: (page, per_page, applied) => getAllPaginated({ page, per_page, ...applied }),
})

// The user filter is gated separately by the API
// (RequirePermissionForQueryParam): sending user_id without user.index fails
// the whole request, so the picker is only offered to someone who may use it.
const { hasPermission } = useAuthStore()
const canFilterByUser = computed(() => hasPermission(Permission.UserIndex))
const { getAllPaginated: getUsers, usersCollection } = useUserService()

const methodOptions = ['POST', 'PATCH', 'PUT', 'DELETE'].map((m) => ({ id: m, name: m }))
const userOptions = computed(() =>
  usersCollection.value.data.map((u) => ({
    id: u.id,
    name: [u.first_name, u.last_name].filter(Boolean).join(' '),
  })),
)

onMounted(() => {
  if (canFilterByUser.value) getUsers({ page: 1, per_page: 100 })
})

const modalDetailRef = useTemplateRef<InstanceType<typeof ModalActivityLogDetail>>('modalDetailRef')
const viewDetail = (log: ActivityLog) => modalDetailRef.value?.handleModal(true, log)
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 overflow-auto p-5 lg:col-span-9 lg:overflow-visible">
      <div class="mb-4 flex justify-end">
        <FilterPopover :active="hasActiveFilters">
          <div class="relative">
            <!-- Autofill guards, same as the users list: a filter input must
                 never be treated as a login field. -->
            <Input
              v-model="filters.search"
              type="text"
              name="audit-search"
              autocomplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-bwignore
              data-form-type="other"
              :placeholder="$t('system.audits.searchPlaceholder')"
              class="w-full pr-8"
            />
            <Lucide
              class="text-foreground/40 absolute inset-y-0 right-0 my-auto mr-2.5 size-4"
              icon="Search"
            />
          </div>

          <TomSelect
            v-model="filters.method"
            :options="methodOptions"
            :placeholder="$t('system.audits.allMethods')"
          />

          <Input
            v-model="filters.status_code"
            type="number"
            :placeholder="$t('system.audits.statusCodePlaceholder')"
            class="w-full"
          />

          <TomSelect
            v-if="canFilterByUser"
            v-model="filters.user_id"
            :options="userOptions"
            :placeholder="$t('system.audits.allUsers')"
          />

          <Input
            v-model="filters.date_from"
            type="date"
            class="w-full"
            :aria-label="$t('system.audits.dateFrom')"
          />
          <Input
            v-model="filters.date_to"
            type="date"
            class="w-full"
            :aria-label="$t('system.audits.dateTo')"
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
              <TH icon="User">{{ $t('system.audits.columnUser') }}</TH>
              <TH icon="Route">{{ $t('system.audits.columnRequest') }}</TH>
              <TH icon="Activity">{{ $t('common.status') }}</TH>
              <TH icon="Globe">{{ $t('system.audits.columnIp') }}</TH>
              <TH icon="Calendar">{{ $t('common.createdAt') }}</TH>
              <TH icon="Settings">{{ $t('common.actions') }}</TH>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(log, index) in logs" :key="log.id">
              <TD>{{ meta.from + index }}</TD>
              <TD>
                <template v-if="log.user">
                  <p class="font-medium">
                    {{ [log.user.first_name, log.user.last_name].filter(Boolean).join(' ') }}
                  </p>
                  <SmallInfo>{{ log.user.email }}</SmallInfo>
                </template>
                <!-- Unauthenticated requests are logged too, with no user -->
                <span v-else class="text-foreground/40 text-sm">{{
                  $t('system.audits.anonymous')
                }}</span>
              </TD>
              <!-- Table cells are nowrap by default; a long path would widen
                   the table into a horizontal scroll rather than wrap. -->
              <TD class="whitespace-normal">
                <div class="flex items-start gap-2">
                  <Badge :variant="httpMethodVariant(log.method)" look="outline" class="shrink-0">
                    {{ log.method }}
                  </Badge>
                  <span class="font-mono text-sm break-all">{{ log.path }}</span>
                </div>
              </TD>
              <TD>
                <Badge :variant="httpStatusVariant(log.status_code)" look="outline">
                  {{ log.status_code }}
                </Badge>
              </TD>
              <TD class="font-mono text-sm">{{ log.ip }}</TD>
              <TD>{{ log.created_at }}</TD>
              <TD>
                <div class="flex items-center gap-1">
                  <ButtonView @click-view="viewDetail(log)" />
                </div>
              </TD>
            </TableRow>
          </TableBody>
        </Table>
      </ServerSidePagination>
    </Box>

    <div class="col-span-12 lg:col-span-3">
      <LiveActivityFeed @view="viewDetail" />
    </div>
  </div>

  <ModalActivityLogDetail ref="modalDetailRef" />
</template>
