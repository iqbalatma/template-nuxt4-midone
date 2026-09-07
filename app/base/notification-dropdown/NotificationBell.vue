<script setup lang="ts">
import { Lucide } from '@/base/ui/lucide'
import { useNotificationStore } from '~/stores/notification'

// The bell icon plus its unread counter. A component rather than markup
// repeated in each theme's header, so the badge cannot drift between the eight
// places the bell is drawn.
const props = withDefaults(defineProps<{ iconClass?: string }>(), { iconClass: '' })

const { unreadCount } = storeToRefs(useNotificationStore())

// Past 9 the exact number stops being useful and starts widening the header.
const label = computed(() => (unreadCount.value > 9 ? '9+' : String(unreadCount.value)))
</script>

<template>
  <span class="relative inline-flex">
    <Lucide icon="Bell" :class="props.iconClass" />
    <span
      v-if="unreadCount > 0"
      class="bg-danger ring-background absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold text-white ring-2"
      :title="`${unreadCount} unread`"
    >
      {{ label }}
    </span>
  </span>
</template>
