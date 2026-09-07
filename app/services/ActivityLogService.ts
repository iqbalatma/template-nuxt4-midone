import type ActivityLog from '~/types/entities/activity_log'
import type {
  PayloadDataCollectionPaginated,
  ResponseDataCollectionWithPagination,
} from '~/types/response'
import { createDefaultPaginated } from '~/utils/helper'

export interface ActivityLogFilter {
  page?: number
  per_page?: number
  search?: string
  method?: string
  status_code?: string
  user_id?: string
  date_from?: string
  date_to?: string
}

/**
 * `user_id` is gated separately by the API
 * (middleware.RequirePermissionForQueryParam): sending it without user.index
 * fails the whole request rather than being ignored, so do not send it from a
 * screen that cannot offer the user picker.
 */
export const useActivityLogService = () => {
  const { $api } = useNuxtApp()
  const logsCollection = ref<PayloadDataCollectionPaginated<ActivityLog>>(createDefaultPaginated())
  const loading = ref(false)

  const getAllPaginated = async (filter: ActivityLogFilter = {}) => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithPagination<ActivityLog>>(
        'api/management/audits',
        {
          method: 'GET',
          query: {
            page: filter.page ?? 1,
            per_page: filter.per_page ?? 10,
            // Empty filters are dropped rather than sent blank - the API treats
            // a present-but-empty `method` as a filter matching nothing.
            ...(filter.search ? { search: filter.search } : {}),
            ...(filter.method ? { method: filter.method } : {}),
            ...(filter.status_code ? { status_code: filter.status_code } : {}),
            ...(filter.user_id ? { user_id: filter.user_id } : {}),
            ...(filter.date_from ? { date_from: filter.date_from } : {}),
            ...(filter.date_to ? { date_to: filter.date_to } : {}),
          },
        },
      )
      logsCollection.value = response.payload
    } finally {
      loading.value = false
    }
  }

  return {
    logsCollection,
    loading,
    getAllPaginated,
  }
}
