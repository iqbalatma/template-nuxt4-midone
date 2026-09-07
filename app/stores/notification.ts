import type AppNotification from '~/types/entities/notification'
import { useNotificationService } from '~/services/NotificationService'

export const useNotificationStore = defineStore('notificationStore', () => {
  const items = ref<AppNotification[]>([])
  // Server-side count, not items.filter(...): an unread notification older than
  // the loaded page still has to light up the bell.
  const unreadCount = ref(0)
  const loading = ref(false)

  const fetch = async (perPage = 10) => {
    const { getAllPaginated, unreadCount: fetchUnreadCount } = useNotificationService()
    loading.value = true
    try {
      items.value = await getAllPaginated(1, perPage)
      unreadCount.value = await fetchUnreadCount()
    } catch {
      // The api plugin already flashed the failure.
    } finally {
      loading.value = false
    }
  }

  const markRead = async (id: string) => {
    const notification = items.value.find((item) => item.id === id)
    if (!notification || notification.is_read) return

    // Optimistic: the bell should respond to the click, not to the round trip.
    notification.is_read = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
    try {
      await useNotificationService().markRead(id)
    } catch {
      notification.is_read = false
      unreadCount.value += 1
    }
  }

  const markAllRead = async () => {
    const previous = items.value.map((item) => item.is_read)
    const previousCount = unreadCount.value

    items.value.forEach((item) => (item.is_read = true))
    unreadCount.value = 0
    try {
      await useNotificationService().markAllRead()
    } catch {
      items.value.forEach((item, index) => (item.is_read = previous[index] ?? false))
      unreadCount.value = previousCount
    }
  }

  /** Called by useNotificationSocket when a live frame arrives. */
  const receive = (notification: AppNotification) => {
    if (items.value.some((item) => item.id === notification.id)) return
    items.value.unshift(notification)
    if (!notification.is_read) unreadCount.value += 1
  }

  const reset = () => {
    items.value = []
    unreadCount.value = 0
  }

  return { items, unreadCount, loading, fetch, markRead, markAllRead, receive, reset }
})
