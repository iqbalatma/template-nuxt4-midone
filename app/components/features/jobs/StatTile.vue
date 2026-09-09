<script setup lang="ts">
import { Box } from '~/base/ui/box'
import { Lucide, type Icon } from '~/base/ui/lucide'

/**
 * One number on the jobs dashboard.
 *
 * A component rather than a repeated block because there are eight of them and
 * they have to read as one row: the same label size, the same value weight, the
 * same place for the hint. Eight hand-written copies is eight chances for one
 * to drift a font size and look broken next to the others.
 */
withDefaults(
  defineProps<{
    icon: Icon
    label: string
    value: string
    /** Tints the value. `secondary` is the neutral default — "nothing to say". */
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary'
    /** One line under the value, for the caveat the number alone would hide. */
    hint?: string
  }>(),
  { variant: 'secondary', hint: '' },
)

const valueClass: Record<string, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  secondary: '',
}
</script>

<template>
  <Box class="p-5">
    <div class="flex items-center gap-2 text-sm opacity-60">
      <Lucide :icon="icon" class="h-4 w-4" />
      <span class="truncate">{{ label }}</span>
    </div>
    <p class="mt-2 text-2xl font-medium" :class="valueClass[variant]">{{ value }}</p>
    <p v-if="hint" class="mt-1 truncate text-xs opacity-40">{{ hint }}</p>
  </Box>
</template>
