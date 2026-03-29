<script lang="ts" setup>
import _ from 'lodash'
import { ref } from 'vue'
import fakers from '@/utils/faker'
import { Button } from '@/base/ui/button'
import { Badge } from '@/base/ui/badge'
import { Input } from '@/base/ui/input'
import { Box } from '@/base/ui/box'
import {
  MenuRoot,
  MenuTrigger,
  MenuPositioner,
  MenuContent,
  MenuCheckboxItem,
} from '@/base/ui/menu'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/base/ui/table'
import { NativeSelect, NativeSelectOption } from '@/base/ui/native-select'
import { AvatarRoot, AvatarFallback, AvatarImage } from '@/base/ui/avatar'
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
import {
  PaginationContext,
  PaginationRoot,
  PaginationItem,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationEllipsis,
} from '@/base/ui/pagination'
import { Map } from '@/base/ui/map'
import { Lucide } from '@/base/ui/lucide'
import { Line1, Line2, Pie1, Donut1, Donut2 } from '@/base/chart-presets'

const pc = ref(false)
const electronic = ref(false)
const smartphone = ref(false)
const photography = ref(false)
const sport = ref(false)
</script>

<template>
  <!-- BEGIN: Transactions -->
  <div class="flex h-10 items-center">
    <h2 class="me-5 truncate text-lg font-medium">Transactions</h2>
  </div>
  <div class="mt-5">
    <Box
      v-for="(faker, fakerKey) in _.take(fakers, 5)"
      class="mb-3 flex items-center px-5 py-3 before:hidden"
    >
      <AvatarRoot class="size-11">
        <AvatarFallback>PA</AvatarFallback>
        <AvatarImage :src="faker['photos'][0]" alt="avatar" />
      </AvatarRoot>
      <div class="me-auto ms-4">
        <div class="font-medium">{{ faker['users'][0]!['name'] }}</div>
        <div class="mt-1 text-xs opacity-70">
          {{ faker['dates'][0] }}
        </div>
      </div>
      <div
        :class="{
          'text-success': faker['trueFalse'][0],
          'text-danger': !faker['trueFalse'][0],
        }"
      >
        {{ faker['trueFalse'][0] ? '+' : '-' }}${{ faker['totals'][0] }}
      </div>
    </Box>
    <Box as-child>
      <Button variant="ghost" class="box h-12 w-full border-dotted">View More</Button>
    </Box>
  </div>
  <!-- END: Transactions -->
</template>
