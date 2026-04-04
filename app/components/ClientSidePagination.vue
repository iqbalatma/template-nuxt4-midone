<script setup lang="ts">
import { Table } from '~/base/ui/table'
import { computed, onMounted, ref, watch } from 'vue'
import { NativeSelect, NativeSelectOption } from '@/base/ui/native-select'
import {
  PaginationContext,
  PaginationRoot,
  PaginationItem,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationEllipsis,
} from '~/base/ui/pagination'

const props = defineProps({
  data: {
    required: true,
    type: Object,
  },
  isWithBox: {
    required: false,
    type: Boolean,
    default: false,
  },
})
const cData = computed(() => props.data)
const perPageOptions = [10, 20, 50, 100]
const currentPage = ref<number>(1)
const perPage = ref<number>(10)
const start = ref<number>(1)
const end = ref<number>(10)
const totalPages = computed(() => Math.ceil(cData.value.length / perPage.value))
const paginationKey = ref<number>(0)

const paginatedData = ref([])
const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
  }
}

onMounted(() => {
  updatePaginatedData(currentPage.value, perPage.value)
})

watch([currentPage, perPage], ([newCurrentPage, newCurrentPerPage]) => {
  updatePaginatedData(newCurrentPage, newCurrentPerPage)
})

watch(cData, () => {
  currentPage.value = 1
  paginationKey.value++
  updatePaginatedData(1, perPage.value)
})

watch(perPage, () => {
  currentPage.value = 1
  paginationKey.value++
})

const updatePaginatedData = (currentPage: number, perPage: number) => {
  start.value = currentPage * perPage - (perPage - 1)
  end.value = start.value + perPage - 1
  if (end.value >= cData.value.length) {
    end.value = cData.value.length
  }
  paginatedData.value = cData.value.slice(start.value - 1, end.value)
}

const handlePageChange = (details: { page: number }) => {
  changePage(details.page)
}
</script>

<template>
  <template v-if="paginatedData.length > 0">
    <Table class="-mt-2" variant="boxed">
      <slot :data="paginatedData" :start="start"></slot>
    </Table>

    <div
      class="flex flex-wrap items-center justify-between col-span-12 mt-4 intro-y sm:flex-nowrap"
    >
      <PaginationRoot
        :key="paginationKey"
        :count="cData.length"
        :pageSize="perPage"
        :siblingCount="2"
        :onPageChange="handlePageChange"
        class="w-full sm:w-auto sm:mr-auto"
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

      <div class="flex items-center gap-3 mt-3 sm:mt-0">
        <span class="hidden text-slate-500 text-sm md:inline">
          Showing {{ start }} to {{ end }} of {{ cData.length }} entries
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

  <EmptyData :isWithBox="isWithBox" v-else />
</template>

<style scoped></style>
