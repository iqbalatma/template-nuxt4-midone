<script setup lang="ts">
import { computed } from 'vue'
import { Box } from '~/base/ui/box'
import { Lucide } from '~/base/ui/lucide'
import { TomSelect } from '~/base/ui/tom-select'
import {
  PaginationContext,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '~/base/ui/pagination'
import type { PaginationMeta } from '~/types/response'
import { getDefaultPerPage } from '~/utils/helper'

const props = withDefaults(
  defineProps<{
    meta: PaginationMeta
    loading?: boolean
    isWithBox?: boolean
    perPageOptions?: number[]
  }>(),
  {
    loading: false,
    isWithBox: false,
    // The Go API rejects per_page above utils.MaximumPerPage (100)
    perPageOptions: () => [10, 20, 50, 100],
  },
)

const perPageItems = computed(() =>
  props.perPageOptions.map((option) => ({ id: option, name: String(option) })),
)

const route = useRoute()

const currentPage = computed(() => Number(route.query['page']) || 1)
const currentPerPage = computed(() => Number(route.query['per_page']) || getDefaultPerPage())

// Page state lives in the URL so it survives reloads and back/forward
const handlePageChange = (details: { page: number }) => {
  navigateTo({ query: { ...route.query, page: details.page } })
}

// TomSelect always emits strings, and its placeholder option emits an empty
// one. Bailing on anything that is not a real change also stops the round trip
// the modelValue watcher would otherwise make: it re-sets the control from the
// URL, which fires change again with the value we just navigated to.
const handlePerPageChange = (value: string | string[]) => {
  const perPage = Number(Array.isArray(value) ? value[0] : value)
  if (!perPage || perPage === currentPerPage.value) return
  navigateTo({ query: { ...route.query, page: 1, per_page: perPage } })
}
</script>

<template>
  <component :is="isWithBox ? Box : 'div'">
    <!-- First load, nothing to show yet -->
    <div
      v-if="loading && meta.total === 0"
      class="flex items-center justify-center gap-3 py-16 text-foreground/50"
    >
      <Lucide icon="LoaderCircle" class="h-5 w-5 animate-spin" />
      <span class="text-sm">Loading...</span>
    </div>

    <EmptyData v-else-if="!loading && meta.total === 0" />

    <template v-else>
      <div class="relative overflow-x-auto">
        <!-- Keeps the table visible while the next page is fetched -->
        <div
          v-if="loading"
          class="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]"
        >
          <Lucide icon="LoaderCircle" class="h-5 w-5 animate-spin text-foreground/50" />
        </div>
        <slot />
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
        <PaginationRoot
          :key="`page-${currentPage}-size-${currentPerPage}`"
          :count="meta.total"
          :pageSize="meta.per_page"
          :page="currentPage"
          :siblingCount="2"
          :onPageChange="handlePageChange"
        >
          <PaginationPrevTrigger>Previous</PaginationPrevTrigger>
          <PaginationContext v-slot="{ pagination }">
            <template v-for="(page, index) in pagination?.pages" :key="index">
              <PaginationItem v-if="page.type === 'page'" v-bind="{ ...page }">
                {{ page.value }}
              </PaginationItem>
              <PaginationEllipsis v-else :index="index" />
            </template>
          </PaginationContext>
          <PaginationNextTrigger>Next</PaginationNextTrigger>
        </PaginationRoot>

        <div class="flex items-center gap-3">
          <span class="hidden text-sm text-foreground/50 md:inline">
            Showing {{ meta.from }}&ndash;{{ meta.to }} of {{ meta.total }} entries
          </span>
          <TomSelect
            class="w-24"
            :model-value="currentPerPage"
            :options="perPageItems"
            :placeholder="String(currentPerPage)"
            aria-label="Rows per page"
            @update:model-value="handlePerPageChange"
          />
        </div>
      </div>
    </template>
  </component>
</template>