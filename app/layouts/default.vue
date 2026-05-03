<template>
  <ThemesLayout>
    <slot />
  </ThemesLayout>
</template>

<script setup lang="ts">
import ThemesLayout from '@/themes'

const { connect, disconnect } = usePresenceWebSocket()

onMounted(connect)
onUnmounted(disconnect)
</script>
