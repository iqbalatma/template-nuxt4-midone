<template>
  <ThemesLayout>
    <slot />
  </ThemesLayout>
</template>

<script setup lang="ts">
import ThemesLayout from '@/themes'
import { useNotificationSocket } from '~/composables/useNotificationSocket'
import { useNotificationStore } from '~/stores/notification'

// This layout only mounts for authenticated pages, so it is the right place to
// open the live feed: one connection per session rather than one per component
// that happens to show a bell.
const notificationStore = useNotificationStore()
let disconnect: (() => void) | null = null

onMounted(() => {
  notificationStore.fetch()
  disconnect = useNotificationSocket()
})

onUnmounted(() => disconnect?.())
</script>
