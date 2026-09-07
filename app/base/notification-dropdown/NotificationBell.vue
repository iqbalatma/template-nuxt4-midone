<script setup lang="ts">
import { Lucide } from '@/base/ui/lucide'
import { useNotificationStore } from '~/stores/notification'

// The bell icon plus its unread marker. A component rather than markup repeated
// in each theme's header, so the dot cannot drift between the eight places the
// bell is drawn.
const { unreadCount } = storeToRefs(useNotificationStore())
</script>

<template>
  <span class="relative inline-flex">
    <Lucide icon="Bell" />
    <span
      v-if="unreadCount > 0"
      class="bg-danger ring-background absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2"
      :title="`${unreadCount} unread`"
    />
  </span>
</template>
