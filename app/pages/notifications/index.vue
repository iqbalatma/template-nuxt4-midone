<script setup lang="ts">
import { computed, watch } from 'vue'
import { Box } from '~/base/ui/box'
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { useNotificationService } from '~/services/NotificationService'
import { useNotificationStore } from '~/stores/notification'
import { getDefaultPerPage } from '~/utils/helper'

definePageMeta({
  title: 'notifications.title',
  pageSubTitle: 'notifications.subtitle',
})

const route = useRoute()
const { getAllPaginated, notificationsCollection, loading } = useNotificationService()
// The store backs the bell and the live socket; this page paginates the full
// history through the service, then tells the store when something is read so
// both stay in step.
const store = useNotificationStore()

const fetchNotifications = () =>
  getAllPaginated(
    Number(route.query['page']) || 1,
    Number(route.query['per_page']) || getDefaultPerPage(),
  )

watch(() => route.query, fetchNotifications, { immediate: true, deep: true })

const notifications = computed(() => notificationsCollection.value.data)
const meta = computed(() => notificationsCollection.value.meta)

const onRead = async (id: string) => {
  const notification = notifications.value.find((item) => item.id === id)
  if (!notification || notification.is_read) return
  notification.is_read = true
  await store.markRead(id)
}

const onReadAll = async () => {
  notifications.value.forEach((item) => (item.is_read = true))
  await store.markAllRead()
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 p-5">
      <div class="mb-4 flex items-center justify-between">
        <div class="font-medium">
          {{ $t('notifications.inbox') }}
          <span v-if="store.unreadCount > 0" class="text-primary ml-1 text-sm">
            {{ $t('notifications.unreadCount', { count: store.unreadCount }) }}
          </span>
        </div>
        <Button look="outline" :disabled="store.unreadCount === 0" @click="onReadAll()">
          <Lucide icon="CheckCheck" />
          {{ $t('notifications.markAllRead') }}
        </Button>
      </div>

      <ServerSidePagination :meta="meta" :loading="loading">
        <div class="flex flex-col gap-2">
          <button
            v-for="notification in notifications"
            :key="notification.id"
            type="button"
            class="border-foreground/10 hover:bg-foreground/5 flex items-start gap-3 rounded-xl border p-4 text-left"
            :class="{ 'bg-primary/5': !notification.is_read }"
            @click="onRead(notification.id)"
          >
            <span
              class="mt-2 h-2 w-2 flex-none rounded-full"
              :class="notification.is_read ? 'bg-transparent' : 'bg-primary'"
            />
            <span class="flex flex-1 flex-col gap-1">
              <span class="flex items-center justify-between gap-3">
                <span class="font-medium" :class="{ 'opacity-70': notification.is_read }">
                  {{ notification.title }}
                </span>
                <span class="flex-none text-xs opacity-70">{{ notification.f_created_at }}</span>
              </span>
              <span class="opacity-70">{{ notification.body }}</span>
              <SmallInfo>{{ notification.type }}</SmallInfo>
            </span>
          </button>

          <EmptyData v-if="!loading && notifications.length === 0" />
        </div>
      </ServerSidePagination>
    </Box>
  </div>
</template>
