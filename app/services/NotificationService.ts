import type AppNotification from '~/types/entities/notification'
import type {
  PayloadDataCollectionPaginated,
  ResponseDataCollectionWithPagination,
  ResponseSingleData,
} from '~/types/response'
import { createDefaultPaginated } from '~/utils/helper'

export const useNotificationService = () => {
  const { $api } = useNuxtApp()
  const notificationsCollection =
    ref<PayloadDataCollectionPaginated<AppNotification>>(createDefaultPaginated())
  const loading = ref(false)

  const getAllPaginated = async (page = 1, perPage = 10) => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithPagination<AppNotification>>(
        'api/notifications',
        { method: 'GET', query: { page, per_page: perPage } },
      )
      notificationsCollection.value = response.payload
      return response.payload.data
    } finally {
      loading.value = false
    }
  }

  /**
   * Counted server-side rather than derived from the loaded page - the bell has
   * to be right even when the unread notification sits on page 4.
   */
  const unreadCount = async (): Promise<number> => {
    const response = await $api<ResponseSingleData<{ unread_count: number }>>(
      'api/notifications/unread-count',
      { method: 'GET' },
    )
    return response.payload.data.unread_count
  }

  const markRead = async (id: string) => {
    await $api(`api/notifications/${id}/read`, { method: 'PATCH' })
  }

  const markAllRead = async () => {
    await $api('api/notifications/read-all', { method: 'PATCH' })
  }

  return {
    notificationsCollection,
    loading,
    getAllPaginated,
    unreadCount,
    markRead,
    markAllRead,
  }
}
