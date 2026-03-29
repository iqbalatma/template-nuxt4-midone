<script lang="ts" setup>
import { ref } from 'vue'
import { today, getLocalTimeZone } from '@internationalized/date'
import phoneIllustration from '@/assets/images/phone-illustration.svg'
import womanIllustration from '@/assets/images/woman-illustration.svg'
import { Badge } from '@/base/ui/badge'
import { Box } from '@/base/ui/box'
import {
  CarouselRoot,
  CarouselPrevTrigger,
  CarouselNextTrigger,
  CarouselItemGroup,
  CarouselItem,
} from '@/base/ui/carousel'
import {
  DatePickerRoot,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerPositioner,
  DatePickerContent,
  DatePickerYearSelect,
  DatePickerMonthSelect,
  DatePickerView,
  DatePickerViewControl,
  DatePickerPrevTrigger,
  DatePickerNextTrigger,
  DatePickerRangeText,
  DatePickerTable,
  DatePickerTableHead,
  DatePickerTableRow,
  DatePickerTableHeader,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerContext,
} from '@/base/ui/datepicker'
import { DialogRoot, DialogContent, DialogCloseTrigger } from '@/base/ui/dialog'
import { Field, FieldLabel, FieldGroup } from '@/base/ui/field'
import { Input } from '@/base/ui/input'
import { Lucide } from '@/base/ui/lucide'
import {
  MenuRoot,
  MenuTrigger,
  MenuPositioner,
  MenuContent,
  MenuCheckboxItem,
} from '@/base/ui/menu'
import { NativeSelect, NativeSelectOption } from '@/base/ui/native-select'
import { Line1, Line2, Pie1, Donut1, Donut2 } from '@/base/chart-presets'
import { Transactions } from '@/base/transactions'
import { RecentActivities } from '@/base/recent-activities'
import { DailyNotes } from '@/base/daily-notes'
import { Schedules } from '@/base/schedules'
import { OfficialStores } from '@/base/official-stores'
import { WeeklyBestSellers } from '@/base/weekly-best-sellers'
import { WeeklyTopProducts } from '@/base/weekly-top-products'

const pc = ref(false)
const electronic = ref(false)
const smartphone = ref(false)
const photography = ref(false)
const sport = ref(false)
const onboardingDialog = ref(true)
const salesReportDate = ref<any[]>([
  today(getLocalTimeZone()).subtract({ days: 7 }),
  today(getLocalTimeZone()),
])
</script>

<template>
  <div>
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 2xl:col-span-9">
        <div class="grid grid-cols-12 gap-6">
          <!-- BEGIN: General Report -->
          <div class="col-span-12">
            <div class="flex h-10 items-center">
              <h2 class="me-5 truncate text-lg font-medium">General Report</h2>
              <a class="text-primary ms-auto flex items-center gap-3" href="">
                <Lucide icon="RefreshCcw" /> Refresh
              </a>
            </div>
            <div class="mt-5 grid grid-cols-12 gap-6">
              <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                <Box raised="single">
                  <div class="flex">
                    <Lucide
                      class="h-7 w-7 stroke-1 drop-shadow [--color:var(--color-primary)]"
                      icon="CircleGauge"
                    />
                    <div class="ms-auto">
                      <Badge variant="success" look="outline" content="12% Higher than last month">
                        12%
                        <Lucide class="ms-0.5" icon="ChevronUp" />
                      </Badge>
                    </div>
                  </div>
                  <div class="mt-6 text-2xl font-medium leading-8">$724,091.47</div>
                  <div class="mt-1.5 text-xs uppercase opacity-70">Item Sales</div>
                </Box>
              </div>
              <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                <Box raised="single">
                  <div class="flex">
                    <Lucide
                      class="h-7 w-7 stroke-1 [--color:var(--color-pending)]"
                      icon="PanelBottomClose"
                    />
                    <div class="ms-auto">
                      <Badge variant="success" look="outline" content="9% Higher than last month">
                        9%
                        <Lucide class="ms-0.5" icon="ChevronUp" />
                      </Badge>
                    </div>
                  </div>
                  <div class="mt-6 text-2xl font-medium leading-8">21,546</div>
                  <div class="mt-1.5 text-xs uppercase opacity-70">New Orders</div>
                </Box>
              </div>
              <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                <Box raised="single">
                  <div class="flex">
                    <Lucide class="h-7 w-7 stroke-1 [--color:var(--color-warning)]" icon="Disc3" />
                    <div class="ms-auto">
                      <Badge variant="danger" look="outline" content="7% Lower than last month">
                        7%
                        <Lucide class="ms-0.5" icon="ChevronDown" />
                      </Badge>
                    </div>
                  </div>
                  <div class="mt-6 text-2xl font-medium leading-8">1,524,091</div>
                  <div class="mt-1.5 text-xs uppercase opacity-70">Total Products</div>
                </Box>
              </div>
              <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                <Box raised="single">
                  <div class="flex">
                    <Lucide class="h-7 w-7 stroke-1 [--color:var(--color-danger)]" icon="Album" />
                    <div class="ms-auto">
                      <Badge variant="success" look="outline" content="41% Higher than last month">
                        41%
                        <Lucide class="ms-0.5" icon="ChevronUp" />
                      </Badge>
                    </div>
                  </div>
                  <div class="mt-6 text-2xl font-medium leading-8">42,924,091</div>
                  <div class="mt-1.5 text-xs uppercase opacity-70">Unique Visitors</div>
                </Box>
              </div>
            </div>
          </div>
          <!-- END: General Report -->
          <!-- BEGIN: Sales Report -->
          <div class="col-span-12 mt-5 lg:col-span-6">
            <div class="block h-10 items-center sm:flex">
              <h2 class="me-5 truncate text-lg font-medium">Sales Report</h2>
              <div class="relative mt-3 sm:ms-auto sm:mt-0">
                <DatePickerRoot
                  selection-mode="range"
                  :num-of-months="2"
                  :value="salesReportDate"
                  @value-change="(details) => (salesReportDate = details.value)"
                >
                  <DatePickerControl>
                    <DatePickerInput :index="0" />
                    <DatePickerTrigger />
                  </DatePickerControl>
                  <DatePickerPositioner>
                    <DatePickerContent>
                      <DatePickerYearSelect />
                      <DatePickerMonthSelect />
                      <DatePickerViewControl>
                        <DatePickerPrevTrigger />
                        <DatePickerRangeText />
                        <DatePickerNextTrigger />
                      </DatePickerViewControl>
                      <DatePickerView view="day" class="flex-row">
                        <DatePickerContext v-slot="{ datePicker }">
                          <DatePickerTable>
                            <DatePickerTableHead>
                              <DatePickerTableRow>
                                <DatePickerTableHeader
                                  v-for="(weekDay, id) in datePicker?.weekDays"
                                  :key="id"
                                >
                                  {{ weekDay.short }}
                                </DatePickerTableHeader>
                              </DatePickerTableRow>
                            </DatePickerTableHead>
                            <DatePickerTableBody>
                              <DatePickerTableRow v-for="(week, id) in datePicker?.weeks" :key="id">
                                <DatePickerTableCell
                                  v-for="(day, id) in week"
                                  :key="id"
                                  :value="day"
                                >
                                  <DatePickerTableCellTrigger>
                                    {{ day.day }}
                                  </DatePickerTableCellTrigger>
                                </DatePickerTableCell>
                              </DatePickerTableRow>
                            </DatePickerTableBody>
                          </DatePickerTable>
                        </DatePickerContext>
                        <DatePickerContext v-slot="{ datePicker }">
                          <DatePickerTable>
                            <DatePickerTableHead>
                              <DatePickerTableRow>
                                <DatePickerTableHeader
                                  v-for="(weekDay, id) in datePicker?.weekDays"
                                  :key="id"
                                >
                                  {{ weekDay.short }}
                                </DatePickerTableHeader>
                              </DatePickerTableRow>
                            </DatePickerTableHead>
                            <DatePickerTableBody>
                              <DatePickerTableRow
                                v-for="(week, id) in datePicker?.getOffset({
                                  months: 1,
                                }).weeks"
                                :key="id"
                              >
                                <DatePickerTableCell
                                  v-for="(day, id) in week"
                                  :key="id"
                                  :value="day"
                                  :visible-range="datePicker?.getOffset({ months: 1 }).visibleRange"
                                >
                                  <DatePickerTableCellTrigger>
                                    {{ day.day }}
                                  </DatePickerTableCellTrigger>
                                </DatePickerTableCell>
                              </DatePickerTableRow>
                            </DatePickerTableBody>
                          </DatePickerTable>
                        </DatePickerContext>
                      </DatePickerView>
                    </DatePickerContent>
                  </DatePickerPositioner>
                </DatePickerRoot>
              </div>
            </div>
            <Box class="mt-12 p-5 sm:mt-5">
              <div class="flex flex-col md:flex-row md:items-center">
                <div class="flex">
                  <div>
                    <div class="text-lg font-medium">$24,100,21</div>
                    <div class="mt-1.5 text-xs uppercase opacity-70">This Month</div>
                  </div>
                  <div
                    class="border-foreground/20 mx-4 h-12 w-px border border-r border-dotted xl:mx-6"
                  ></div>
                  <div class="text-foreground/80">
                    <div class="text-lg font-medium">$21,023,01</div>
                    <div class="mt-1.5 text-xs uppercase opacity-70">Last Month</div>
                  </div>
                </div>
                <MenuRoot class="w-auto mt-5 md:ms-auto md:mt-0">
                  <MenuTrigger>Filter by Category</MenuTrigger>
                  <MenuPositioner>
                    <MenuContent>
                      <MenuCheckboxItem
                        :checked="pc"
                        :onCheckedChange="(checked) => (pc = checked)"
                        value="checked"
                      >
                        PC & Laptop
                      </MenuCheckboxItem>
                      <MenuCheckboxItem
                        :checked="smartphone"
                        :onCheckedChange="(checked) => (smartphone = checked)"
                        value="checked"
                      >
                        Smartphone
                      </MenuCheckboxItem>
                      <MenuCheckboxItem
                        :checked="electronic"
                        :onCheckedChange="(checked) => (electronic = checked)"
                        value="checked"
                      >
                        Electronic
                      </MenuCheckboxItem>
                      <MenuCheckboxItem
                        :checked="photography"
                        :onCheckedChange="(checked) => (photography = checked)"
                        value="checked"
                      >
                        Photography
                      </MenuCheckboxItem>
                      <MenuCheckboxItem
                        :checked="sport"
                        :onCheckedChange="(checked) => (sport = checked)"
                        value="checked"
                      >
                        Sport
                      </MenuCheckboxItem>
                    </MenuContent>
                  </MenuPositioner>
                </MenuRoot>
              </div>
              <Line1 class="mt-6 h-[275px]" />
            </Box>
          </div>
          <!-- END: Sales Report -->
          <!-- BEGIN: Weekly Top Seller -->
          <div class="col-span-12 mt-5 sm:col-span-6 lg:col-span-3">
            <div class="flex h-10 items-center">
              <h2 class="me-5 truncate text-lg font-medium">Weekly Top Seller</h2>
              <a class="text-primary ms-auto truncate" href=""> Show More </a>
            </div>
            <Box class="mt-5 p-5">
              <div class="mt-3">
                <Pie1 class="h-[213px]" />
              </div>
              <div class="mx-auto mt-8 w-52 sm:w-auto">
                <div class="flex items-center">
                  <div
                    class="bg-(--color)/20 border-(--color)/60 me-3 size-2 rounded-full border [--color:var(--color-primary)]"
                  ></div>
                  <span class="truncate">17 - 30 Years old</span>
                  <span class="ms-auto">62%</span>
                </div>
                <div class="mt-4 flex items-center">
                  <div
                    class="bg-(--color)/20 border-(--color)/60 me-3 size-2 rounded-full border [--color:var(--color-pending)]"
                  ></div>
                  <span class="truncate">31 - 50 Years old</span>
                  <span class="ms-auto">33%</span>
                </div>
                <div class="mt-4 flex items-center">
                  <div
                    class="bg-(--color)/20 border-(--color)/60 me-3 size-2 rounded-full border [--color:var(--color-warning)]"
                  ></div>
                  <span class="truncate">&gt;= 50 Years old</span>
                  <span class="ms-auto">10%</span>
                </div>
              </div>
            </Box>
          </div>
          <!-- END: Weekly Top Seller -->
          <!-- BEGIN: Sales Report -->
          <div class="col-span-12 mt-5 sm:col-span-6 lg:col-span-3">
            <div class="flex h-10 items-center">
              <h2 class="me-5 truncate text-lg font-medium">Sales Report</h2>
              <a class="text-primary ms-auto truncate" href=""> Show More </a>
            </div>
            <Box class="mt-5 p-5">
              <div class="mt-3">
                <Donut1 class="h-[213px]" />
              </div>
              <div class="mx-auto mt-8 w-52 sm:w-auto">
                <div class="flex items-center">
                  <div
                    class="bg-(--color)/20 border-(--color)/60 me-3 size-2 rounded-full border [--color:var(--color-primary)]"
                  ></div>
                  <span class="truncate">17 - 30 Years old</span>
                  <span class="ms-auto">62%</span>
                </div>
                <div class="mt-4 flex items-center">
                  <div
                    class="bg-(--color)/20 border-(--color)/60 me-3 size-2 rounded-full border [--color:var(--color-pending)]"
                  ></div>
                  <span class="truncate">31 - 50 Years old</span>
                  <span class="ms-auto">33%</span>
                </div>
                <div class="mt-4 flex items-center">
                  <div
                    class="bg-(--color)/20 border-(--color)/60 me-3 size-2 rounded-full border [--color:var(--color-warning)]"
                  ></div>
                  <span class="truncate">&gt;= 50 Years old</span>
                  <span class="ms-auto">10%</span>
                </div>
              </div>
            </Box>
          </div>
          <!-- END: Sales Report -->
          <!-- BEGIN: Official Store -->
          <div class="col-span-12 mt-6 xl:col-span-8">
            <OfficialStores />
          </div>
          <!-- END: Official Store -->
          <!-- BEGIN: Weekly Best Sellers -->
          <div class="col-span-12 mt-6 xl:col-span-4">
            <WeeklyBestSellers />
          </div>
          <!-- END: Weekly Best Sellers -->
          <!-- BEGIN: General Report -->
          <div class="col-span-12 mt-8 grid grid-cols-12 gap-6">
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3">
              <Box class="p-5">
                <div class="flex items-center">
                  <div class="w-2/4 flex-none">
                    <div class="truncate text-lg font-medium">Target Sales</div>
                    <div class="mt-1 opacity-70">300 Sales</div>
                  </div>
                  <div class="relative ms-auto flex-none">
                    <Donut2 class="w-[90px] h-[90px]" />
                    <div
                      class="absolute start-0 top-0 flex h-full w-full items-center justify-center font-medium"
                    >
                      20%
                    </div>
                  </div>
                </div>
              </Box>
            </div>
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3">
              <Box class="p-5">
                <div class="flex items-center">
                  <div class="me-3 truncate text-lg font-medium">Social Media</div>
                  <Badge variant="secondary" look="outline" class="ms-auto whitespace-nowrap"
                    >137 Sales</Badge
                  >
                </div>
                <div class="mt-1">
                  <Line2 class="-ms-1 h-[58px]" />
                </div>
              </Box>
            </div>
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3">
              <Box class="p-5">
                <div class="flex items-center">
                  <div class="w-2/4 flex-none">
                    <div class="truncate text-lg font-medium">New Products</div>
                    <div class="mt-1 opacity-70">1450 Products</div>
                  </div>
                  <div class="relative ms-auto flex-none">
                    <Donut2 class="w-[90px] h-[90px]" />
                    <div
                      class="absolute start-0 top-0 flex h-full w-full items-center justify-center font-medium"
                    >
                      45%
                    </div>
                  </div>
                </div>
              </Box>
            </div>
            <div class="col-span-12 sm:col-span-6 2xl:col-span-3">
              <Box class="p-5">
                <div class="flex items-center">
                  <div class="me-3 truncate text-lg font-medium">Posted Ads</div>
                  <Badge variant="secondary" look="outline" class="ms-auto whitespace-nowrap"
                    >180 Campaign</Badge
                  >
                </div>
                <div class="mt-1">
                  <Line2 class="-ms-1 h-[58px]" />
                </div>
              </Box>
            </div>
          </div>
          <!-- END: General Report -->
          <!-- BEGIN: Weekly Top Products -->
          <div class="col-span-12 mt-6">
            <WeeklyTopProducts />
          </div>
          <!-- END: Weekly Top Products -->
        </div>
      </div>
      <div class="col-span-12 2xl:col-span-3">
        <div class="-mb-10 h-full pb-10 2xl:border-l border-foreground/15">
          <div class="grid grid-cols-12 gap-x-6 gap-y-6 2xl:gap-x-0 2xl:pl-6">
            <!-- BEGIN: Transactions -->
            <div class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12">
              <Transactions />
            </div>
            <!-- END: Transactions -->
            <!-- BEGIN: Recent Activities -->
            <div class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12">
              <RecentActivities />
            </div>
            <!-- END: Recent Activities -->
            <!-- BEGIN: Daily Notes -->
            <div
              class="col-span-12 mt-3 md:col-span-6 xl:col-span-12 xl:col-start-1 xl:row-start-1 2xl:col-start-auto 2xl:row-start-auto"
            >
              <DailyNotes />
            </div>
            <!-- END: Daily Notes -->
            <!-- BEGIN: Schedules -->
            <div
              class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 xl:col-start-1 xl:row-start-2 2xl:col-span-12 2xl:col-start-auto 2xl:row-start-auto"
            >
              <Schedules />
            </div>
            <!-- END: Schedules -->
          </div>
        </div>
      </div>
    </div>
    <!-- BEGIN: Onboarding Dialog -->
    <DialogRoot
      :open="onboardingDialog"
      @openChange="(details) => (onboardingDialog = details.open)"
    >
      <DialogContent class="sm:max-w-xl">
        <DialogCloseTrigger />
        <div class="overflow-hidden">
          <div class="-my-5 -mx-10">
            <CarouselRoot :default-page="0" :slide-count="2" class="border-0">
              <CarouselItemGroup>
                <CarouselItem class="border-transparent bg-none bg-transparent" :index="0">
                  <div class="relative mx-3 flex flex-col items-center gap-1 px-3.5 pb-20">
                    <div
                      class="w-full bg-primary/[.05] mb-7 border-primary/10 shadow-lg shadow-black/10 relative rounded-3xl border h-52 overflow-hidden before:bg-noise before:absolute before:inset-0 before:opacity-30 after:bg-accent after:absolute after:inset-0 after:opacity-30 after:blur-2xl"
                    >
                      <img
                        class="absolute inset-0 mx-auto mt-10 w-2/5 scale-125"
                        :src="phoneIllustration"
                        alt="Midone - Tailwind Admin Dashboard Template"
                      />
                    </div>
                    <div class="px-8">
                      <div class="text-center text-xl font-medium">Welcome to Midone Admin!</div>
                      <div class="mt-3 text-center text-base leading-relaxed opacity-70">
                        Premium admin dashboard template for all kinds <br />
                        of projects. With a unique and modern design, Midone offers the perfect
                        foundation to build professional applications with ease.
                      </div>
                    </div>
                    <div class="absolute inset-x-0 bottom-0 flex place-content-between px-5">
                      <a
                        class="text-danger flex items-center gap-3 font-medium cursor-pointer"
                        @click.prevent="onboardingDialog = false"
                      >
                        Skip Intro
                      </a>
                      <CarouselNextTrigger
                        class="text-primary flex items-center gap-3 font-medium me-0 px-5"
                      >
                        Next <Lucide icon="MoveRight" />
                      </CarouselNextTrigger>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem class="border-transparent bg-none bg-transparent" :index="1">
                  <div class="relative mx-3 flex flex-col items-center gap-1 px-3.5 pb-20">
                    <div
                      class="w-full bg-primary/[.05] mb-7 border-primary/10 shadow-lg shadow-black/10 relative rounded-3xl border h-52 overflow-hidden before:bg-noise before:absolute before:inset-0 before:opacity-30 after:bg-accent after:absolute after:inset-0 after:opacity-30 after:blur-2xl"
                    >
                      <img
                        class="absolute inset-0 mx-auto mt-10 w-2/5 scale-125"
                        :src="womanIllustration"
                        alt="Midone - Tailwind Admin Dashboard Template"
                      />
                    </div>
                    <div class="w-full">
                      <div class="text-center text-xl font-medium">Example Request Information</div>
                      <div class="mt-3 text-center text-base leading-relaxed opacity-70">
                        Your premium admin dashboard template.
                      </div>
                      <div class="mt-8">
                        <FieldGroup class="px-5">
                          <div class="grid grid-cols-2 gap-5">
                            <Field>
                              <FieldLabel>Full Name</FieldLabel>
                              <Input type="text" placeholder="John Doe" />
                            </Field>
                            <Field>
                              <FieldLabel>Event</FieldLabel>
                              <NativeSelect>
                                <NativeSelectOption>Corporate Event</NativeSelectOption>
                                <NativeSelectOption>Wedding</NativeSelectOption>
                                <NativeSelectOption>Birthday</NativeSelectOption>
                                <NativeSelectOption>Other</NativeSelectOption>
                              </NativeSelect>
                            </Field>
                          </div>
                        </FieldGroup>
                      </div>
                    </div>
                    <div class="absolute inset-x-0 bottom-0 flex place-content-between px-5">
                      <CarouselPrevTrigger
                        class="text-primary flex items-center gap-3 font-medium ms-0 px-5"
                      >
                        <Lucide icon="MoveLeft" /> Previous
                      </CarouselPrevTrigger>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselItemGroup>
            </CarouselRoot>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
    <!-- END: Onboarding Dialog -->
  </div>
</template>
