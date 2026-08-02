<script setup lang="ts" generic="T">
import { computed, ref, watch } from 'vue'
import { Table } from '~/base/ui/table'
import { NativeSelect, NativeSelectOption } from '~/base/ui/native-select'
import {
  PaginationContext,
  PaginationRoot,
  PaginationItem,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationEllipsis,
} from '~/base/ui/pagination'
import { getDefaultPerPage } from '~/utils/helper'

const props = withDefaults(
  defineProps<{
    data: T[]
    isWithBox?: boolean
  }>(),
  {
    isWithBox: false,
  },
)

defineSlots<{
  default: (props: { data: T[]; start: number }) => unknown
}>()

const perPageOptions = [10, 20, 50, 100]
const currentPage = ref(1)
const perPage = ref(getDefaultPerPage())

// 1-based index of the first row on the page, so tables can render a running "No." column
const start = computed(() => (currentPage.value - 1) * perPage.value + 1)
const end = computed(() => Math.min(start.value + perPage.value - 1, props.data.length))
const paginatedData = computed(() => props.data.slice(start.value - 1, end.value))

// Remounts PaginationRoot so its internal page state follows ours after a reset
const paginationKey = ref(0)

watch([() => props.data, perPage], () => {
  currentPage.value = 1
  paginationKey.value++
})

const handlePageChange = (details: { page: number }) => {
  currentPage.value = details.page
}
</script>

<template>
  <template v-if="paginatedData.length > 0">
    <Table class="-mt-2" variant="boxed">
      <slot :data="paginatedData" :start="start"></slot>
    </Table>

    <div class="intro-y col-span-12 mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
      <PaginationRoot
        :key="paginationKey"
        :count="data.length"
        :pageSize="perPage"
        :siblingCount="2"
        :onPageChange="handlePageChange"
        class="w-full sm:mr-auto sm:w-auto"
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

      <div class="mt-3 flex items-center gap-3 sm:mt-0">
        <span class="hidden text-sm text-slate-500 md:inline">
          Showing {{ start }} to {{ end }} of {{ data.length }} entries
        </span>
        <NativeSelect
          class="box w-20"
          :value="perPage"
          @change="perPage = Number(($event.target as HTMLSelectElement).value)"
        >
          <NativeSelectOption v-for="option in perPageOptions" :key="option" :value="option">
            {{ option }}
          </NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  </template>

  <EmptyData v-else :isWithBox="isWithBox" />
</template>