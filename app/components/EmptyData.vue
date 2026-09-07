<script setup lang="ts">
import { Lucide } from '~/base/ui/lucide'
import { Box } from '~/base/ui/box'

defineProps({
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  isWithBox: {
    required: false,
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <component :is="isWithBox ? Box : 'div'">
    <div class="flex flex-col items-center justify-center p-8 text-center text-slate-500">
      <Lucide icon="Database" class="mb-4 h-8 w-8 text-slate-400" />
      <h3 class="mb-2 text-xl font-semibold">{{ title || $t('common.emptyDataTitle') }}</h3>
      <p class="text-sm">{{ message || $t('common.emptyDataMessage') }}</p>
    </div>
  </component>
</template>