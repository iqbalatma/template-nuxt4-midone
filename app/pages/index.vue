<script lang="ts" setup>
import { Box } from '@/base/ui/box'
import { Button } from '@/base/ui/button'
import { Lucide, type Icon } from '@/base/ui/lucide'
import { TomSelect } from '@/base/ui/tom-select'
import { Line1, Donut1 } from '@/base/chart-presets'
import { Transactions } from '@/base/transactions'
import { RecentActivities } from '@/base/recent-activities'
import { Schedules } from '@/base/schedules'
import { DailyNotes } from '@/base/daily-notes'
import { WeeklyTopProducts } from '@/base/weekly-top-products'
import { WeeklyBestSellers } from '@/base/weekly-best-sellers'
import { OfficialStores } from '@/base/official-stores'

definePageMeta({
  title: 'Dashboard',
  pageSubTitle: 'Overview of your workspace',
  public: false,
})

// Dummy figures - swap these for real service calls when the endpoints exist
interface SummaryTile {
  icon: Icon
  label: string
  value: string
  delta: string
  isPositive: boolean
}

const summaryTiles: SummaryTile[] = [
  { icon: 'ShoppingCart', label: 'Item Sales', value: '4.510', delta: '33%', isPositive: true },
  { icon: 'CreditCard', label: 'New Orders', value: '3.521', delta: '2%', isPositive: false },
  { icon: 'Monitor', label: 'Total Products', value: '2.145', delta: '12%', isPositive: true },
  { icon: 'User', label: 'Unique Visitor', value: '152.000', delta: '22%', isPositive: true },
]

const salesReportPeriods = ['This Month', 'Last Month', 'This Year']
const salesReportPeriodItems = salesReportPeriods.map((period) => ({ id: period, name: period }))
const salesReportPeriod = ref(salesReportPeriods[0])
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 2xl:col-span-9">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <div class="flex h-10 items-center">
            <h2 class="me-5 truncate text-lg font-medium">General Report</h2>
            <a class="text-primary ms-auto flex items-center truncate" href="#" @click.prevent>
              <Lucide class="me-1" icon="RefreshCcw" /> Reload Data
            </a>
          </div>

          <div class="mt-5 grid grid-cols-12 gap-6">
            <div
              v-for="tile in summaryTiles"
              :key="tile.label"
              class="col-span-12 sm:col-span-6 xl:col-span-3"
            >
              <Box class="p-5">
                <div class="flex">
                  <Lucide class="size-7 text-primary" :icon="tile.icon" />
                  <div
                    class="ms-auto flex items-center rounded-full px-2 py-[3px] text-xs font-medium"
                    :class="
                      tile.isPositive
                        ? 'bg-success/15 text-success'
                        : 'bg-danger/15 text-danger'
                    "
                  >
                    {{ tile.delta }}
                    <Lucide
                      class="ms-0.5 size-3"
                      :icon="tile.isPositive ? 'ChevronUp' : 'ChevronDown'"
                    />
                  </div>
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">{{ tile.value }}</div>
                <div class="mt-1 text-base opacity-70">{{ tile.label }}</div>
              </Box>
            </div>
          </div>
        </div>
        <!-- END: General Report -->

        <!-- BEGIN: Sales Report -->
        <div class="col-span-12 mt-8 lg:col-span-8">
          <div class="flex h-10 items-center">
            <h2 class="me-5 truncate text-lg font-medium">Sales Report</h2>
            <TomSelect
              v-model="salesReportPeriod"
              class="ms-auto w-40"
              :options="salesReportPeriodItems"
              :placeholder="salesReportPeriods[0]"
              aria-label="Sales report period"
            />
          </div>
          <Box class="mt-12 p-5 sm:mt-5">
            <div class="flex flex-col md:flex-row md:items-center">
              <div class="flex">
                <div>
                  <div class="text-lg font-medium text-primary xl:text-xl">$15.000</div>
                  <div class="mt-0.5 text-sm opacity-70">This Month</div>
                </div>
                <div class="mx-4 h-12 w-px border-r border-dashed border-foreground/20 xl:mx-5" />
                <div>
                  <div class="text-lg font-medium opacity-60 xl:text-xl">$10.000</div>
                  <div class="mt-0.5 text-sm opacity-70">Last Month</div>
                </div>
              </div>
              <Button variant="ghost" look="outline" class="mt-5 md:ms-auto md:mt-0">
                <Lucide icon="FileText" />
                Export Report
              </Button>
            </div>
            <div class="mt-6 h-[275px]">
              <Line1 class="h-full" />
            </div>
          </Box>
        </div>
        <!-- END: Sales Report -->

        <!-- BEGIN: Weekly Top Seller -->
        <div class="col-span-12 mt-8 sm:col-span-6 lg:col-span-4">
          <div class="flex h-10 items-center">
            <h2 class="me-5 truncate text-lg font-medium">Weekly Top Seller</h2>
          </div>
          <Box class="mt-12 p-5 sm:mt-5">
            <div class="mt-3 h-[213px]">
              <Donut1 class="h-full" />
            </div>
            <div class="mx-auto mt-8 w-52 sm:w-auto">
              <div class="flex items-center">
                <div class="size-2 rounded-full bg-pending" />
                <span class="ms-3 truncate">Html</span>
                <span class="ms-auto font-medium">62%</span>
              </div>
              <div class="mt-4 flex items-center">
                <div class="size-2 rounded-full bg-primary" />
                <span class="ms-3 truncate">Vuejs</span>
                <span class="ms-auto font-medium">18%</span>
              </div>
              <div class="mt-4 flex items-center">
                <div class="size-2 rounded-full bg-secondary" />
                <span class="ms-3 truncate">Laravel</span>
                <span class="ms-auto font-medium">20%</span>
              </div>
            </div>
          </Box>
        </div>
        <!-- END: Weekly Top Seller -->

        <div class="col-span-12 mt-8">
          <OfficialStores />
        </div>

        <div class="col-span-12 mt-8">
          <WeeklyTopProducts />
        </div>
      </div>
    </div>

    <!-- BEGIN: Right Sidebar -->
    <div class="col-span-12  2xl:col-span-3">
      <div class="pb-10 2xl:border-l 2xl:border-foreground/10 2xl:ps-6">
        <div class="grid grid-cols-12 gap-6 2xl:gap-y-8">
          <div class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
            <Transactions />
          </div>
          <div class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
            <RecentActivities />
          </div>
          <div class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
            <DailyNotes />
          </div>
          <div class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
            <Schedules />
          </div>
          <div class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
            <WeeklyBestSellers />
          </div>
        </div>
      </div>
    </div>
    <!-- END: Right Sidebar -->
  </div>
</template>