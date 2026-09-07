<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { Lucide } from '@/base/ui/lucide'
import { useNotificationStore } from '~/stores/notification'

interface Props {
  class?: string
  boxClass?: string
}

const props = defineProps<Props>()

const store = useNotificationStore()
const { items, unreadCount, loading } = storeToRefs(store)

// The dropdown is a preview, not the feed: five newest, with the full list one
// click away at /notifications.
const preview = computed(() => items.value.slice(0, 5))

const open = async (id: string) => {
  await store.markRead(id)
  await navigateTo('/notifications')
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="[
      'invisible opacity-0 scale-95 transition-all duration-200 delay-0 group-hover/notifications:visible group-hover/notifications:opacity-100 group-hover/notifications:scale-100 group-hover/notifications:delay-200',
      props.class,
    ]"
  >
    <Box
      :class="`before:shadow-foreground/5 z-50 flex w-96 flex-col gap-2.5 px-6 py-5 before:rounded-2xl before:shadow-xl before:backdrop-blur after:rounded-2xl ${props.boxClass ?? ''}`"
    >
      <div class="flex place-content-between items-center">
        <div class="font-medium">
          Notifications
          <span v-if="unreadCount > 0" class="text-primary ml-1 text-xs">({{ unreadCount }})</span>
        </div>
        <NuxtLink class="text-primary" to="/notifications">View More</NuxtLink>
      </div>

      <div class="mt-1 flex flex-col gap-2.5">
        <div v-if="loading" class="py-6 text-center opacity-70">Loading&hellip;</div>

        <div v-else-if="preview.length === 0" class="flex flex-col items-center gap-2 py-6">
          <Lucide icon="BellOff" class="h-6 w-6 opacity-40" />
          <span class="opacity-70">Nothing here yet</span>
        </div>

        <button
          v-for="notification in preview"
          v-else
          :key="notification.id"
          type="button"
          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-2 flex items-start gap-3.5 rounded-2xl border border-transparent p-2 text-left"
          @click="open(notification.id)"
        >
          <span
            class="mt-2 h-2 w-2 flex-none rounded-full"
            :class="notification.is_read ? 'bg-transparent' : 'bg-primary'"
          />
          <span class="flex flex-col gap-1">
            <span class="flex place-content-between items-center gap-2">
              <span class="font-medium" :class="{ 'opacity-70': notification.is_read }">
                {{ notification.title }}
              </span>
              <span class="flex-none text-xs opacity-70">{{ notification.f_created_at }}</span>
            </span>
            <span class="line-clamp-2 opacity-70">{{ notification.body }}</span>
          </span>
        </button>
      </div>
    </Box>
  </div>
</template>
