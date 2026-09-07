<script setup lang="ts">
import { onMounted } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { Table, TableBody, TableHeader, TableRow } from '~/base/ui/table'
import { useCacheService } from '~/services/CacheService'
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'

definePageMeta({
  title: 'Cache',
  pageSubTitle: 'What the API is holding in memory right now',
})

const { entries, loading, clearingKey, getAll, clear } = useCacheService()
const { hasPermission } = useAuthStore()

// Viewing and clearing are separate permissions, so a read-only operator can
// see what is cached without being handed the button that drops it.
const canClear = computed(() => hasPermission(Permission.CacheDestroy))

onMounted(() => getAll())

const onClear = async (key = '') => {
  if (await clear(key)) await getAll()
}

const formatTtl = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 p-5">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm opacity-70">
          The cache lives in the API process. Clearing it here is the same reach as sending that
          process SIGHUP &mdash; writes made through this app already drop what they change.
        </p>
        <div class="flex gap-2">
          <Button look="outline" :disabled="loading" @click="getAll()">
            <Lucide icon="RefreshCw" />
            Refresh
          </Button>
          <Button
            v-if="canClear"
            variant="danger"
            :disabled="clearingKey === '' && clearingKey !== null"
            @click="onClear()"
          >
            <Lucide icon="Trash2" />
            Clear everything
          </Button>
        </div>
      </div>

      <Table class="-mt-2" variant="boxed">
        <TableHeader>
          <TableRow>
            <TH icon="Key">Key</TH>
            <TH icon="Layers">Items</TH>
            <TH icon="Clock">Expires in</TH>
            <TH v-if="canClear" icon="Settings">Actions</TH>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="entry in entries" :key="entry.key">
            <TD class="font-mono text-sm">{{ entry.key }}</TD>
            <TD>
              <Badge variant="secondary" look="outline">{{ entry.count }}</Badge>
            </TD>
            <TD>{{ formatTtl(entry.expires_in_seconds) }}</TD>
            <TD v-if="canClear">
              <Button
                size="sm"
                look="outline"
                :disabled="clearingKey === entry.key"
                @click="onClear(entry.key)"
              >
                Drop
              </Button>
            </TD>
          </TableRow>
        </TableBody>
      </Table>

      <!-- Expired keys are already dead to the cache, so the API leaves them
           out rather than inviting you to clear something that is not there. -->
      <EmptyData v-if="!loading && entries.length === 0" />
    </Box>
  </div>
</template>
