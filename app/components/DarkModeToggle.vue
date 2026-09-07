<script setup lang="ts">
import { Lucide } from '~/base/ui/lucide'
import { useDarkMode } from '~/composables/useDarkMode'

defineProps<{ class?: string }>()

const { isDark, toggleDarkMode, syncDarkMode } = useDarkMode()

syncDarkMode()
</script>

<template>
  <Lucide
    :icon="isDark ? 'Sun' : 'Moon'"
    :class="['cursor-pointer', $props.class]"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    role="button"
    @click="toggleDarkMode"
  />
</template>
