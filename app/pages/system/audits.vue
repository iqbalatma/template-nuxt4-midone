<script setup lang="ts">
import { Box } from '~/base/ui/box'
import { Button } from '~/base/ui/button'
import { Input } from '~/base/ui/input'
import { TomSelect } from '~/base/ui/tom-select'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { useAuditService } from '~/services/AuditService'
import { useUserService } from '~/services/UserService'
import { useServerList } from '~/composables/useServerList'
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'
import ModalAuditDetail from '~/components/features/audits/ModalAuditDetail.vue'
import LiveAuditFeed from '~/components/features/audits/LiveAuditFeed.vue'
import type Audit from '~/types/entities/audit'

definePageMeta({
  title: 'system.audits.title',
  pageSubTitle: 'system.audits.subtitle',
})

const { getAllPaginated, auditsCollection, loading } = useAuditService()

const audits = computed(() => auditsCollection.value.data)
const meta = computed(() => auditsCollection.value.meta)

const { filters, hasActiveFilters, reset } = useServerList({
  filters: {
    entry_object_table: '',
    entry_object_id: '',
    actor_id: '',
    action: '',
    date_from: '',
    date_to: '',
  },
  debounce: ['entry_object_table', 'entry_object_id', 'action'],
  fetch: (page, per_page, applied) => getAllPaginated({ page, per_page, ...applied }),
})

// actor_id itself is not gated by the API — only the picker is, because filling
// it means reading /api/options/users. Someone without that filters by typing
// the action or the audited object instead.
const { hasPermission } = useAuthStore()
const canFilterByActor = computed(() => hasPermission(Permission.OptionUserIndex))
const { getAllOptions: searchUsers } = useUserService()

// ponytail: same as activity-logs — an actor id restored from the URL carries
// no label until it is searched again.
const loadActorOptions = async (query: string) =>
  (await searchUsers(query)).map((u) => ({ id: u.id, name: `${u.name} · ${u.email}` }))

const modalDetailRef = useTemplateRef<InstanceType<typeof ModalAuditDetail>>('modalDetailRef')
const viewDetail = (audit: Audit) => modalDetailRef.value?.handleModal(true, audit)
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 overflow-auto p-5 lg:col-span-9 lg:overflow-visible">
      <div class="mb-4 flex justify-end">
        <FilterPopover :active="hasActiveFilters">
          <Input
            v-model="filters.entry_object_table"
            type="text"
            autocomplete="off"
            :placeholder="$t('system.audits.entryObjectTablePlaceholder')"
            class="w-full"
          />
          <Input
            v-model="filters.entry_object_id"
            type="text"
            autocomplete="off"
            :placeholder="$t('system.audits.entryObjectIdPlaceholder')"
            class="w-full"
          />
          <Input
            v-model="filters.action"
            type="text"
            autocomplete="off"
            :placeholder="$t('system.audits.actionPlaceholder')"
            class="w-full"
          />

          <TomSelect
            v-if="canFilterByActor"
            v-model="filters.actor_id"
            :loadFn="loadActorOptions"
            :placeholder="$t('system.audits.allActors')"
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
              <TH icon="User">{{ $t('system.audits.columnActor') }}</TH>
              <TH icon="Zap">{{ $t('system.audits.columnAction') }}</TH>
              <TH icon="Database">{{ $t('system.audits.columnEntryObject') }}</TH>
              <TH icon="GitCompare">{{ $t('system.audits.columnChanges') }}</TH>
              <TH icon="Calendar">{{ $t('common.createdAt') }}</TH>
              <TH icon="Settings">{{ $t('common.actions') }}</TH>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(audit, index) in audits" :key="audit.id">
              <TD>{{ meta.from + index }}</TD>
              <TD>
                <template v-if="audit.actor_name">
                  <p class="font-medium">{{ audit.actor_name }}</p>
                  <SmallInfo v-if="audit.actor_email">{{ audit.actor_email }}</SmallInfo>
                </template>
                <!-- An action recorded outside a request, or by a caller with
                     no actor in context, still gets a row. -->
                <span v-else class="text-foreground/40 text-sm">
                  {{ $t('system.audits.anonymous') }}
                </span>
              </TD>
              <TD class="whitespace-normal">
                <span class="font-mono text-sm break-all">{{ audit.action }}</span>
              </TD>
              <TD>
                <span v-if="audit.entry_object_table">
                  {{ audit.entry_object_table }} #{{ audit.entry_object_id }}
                </span>
                <span v-else class="text-foreground/40 text-sm">—</span>
              </TD>
              <TD>{{ audit.trails.length }}</TD>
              <TD>{{ audit.created_at }}</TD>
              <TD>
                <div class="flex items-center gap-2">
                  <ButtonView @click-view="viewDetail(audit)" />
                </div>
              </TD>
            </TableRow>
          </TableBody>
        </Table>
      </ServerSidePagination>
    </Box>

    <div class="col-span-12 lg:col-span-3">
      <LiveAuditFeed @view="viewDetail" />
    </div>
  </div>

  <ModalAuditDetail ref="modalDetailRef" />
</template>
