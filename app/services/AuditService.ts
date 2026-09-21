import type Audit from '~/types/entities/audit'
import type {
  PayloadDataCollectionPaginated,
  ResponseDataCollectionWithPagination,
} from '~/types/response'
import { createDefaultPaginated } from '~/utils/helper'

export interface AuditFilter {
  page?: number
  per_page?: number
  entry_object_table?: string
  entry_object_id?: string
  actor_id?: string
  action?: string
  date_from?: string
  date_to?: string
}

/**
 * The field-change trail. Filtered by the audited object rather than by user,
 * so unlike ActivityLogService there is no separately gated query param here.
 */
export const useAuditService = () => {
  const { $api } = useNuxtApp()
  const auditsCollection = ref<PayloadDataCollectionPaginated<Audit>>(createDefaultPaginated())
  const loading = ref(false)

  const getAllPaginated = async (filter: AuditFilter = {}) => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithPagination<Audit>>(
        'api/management/audits',
        {
          method: 'GET',
          query: {
            page: filter.page ?? 1,
            per_page: filter.per_page ?? 10,
            // Empty filters are dropped rather than sent blank — the API
            // treats a present-but-empty value as a filter matching nothing.
            ...(filter.entry_object_table ? { entry_object_table: filter.entry_object_table } : {}),
            ...(filter.entry_object_id ? { entry_object_id: filter.entry_object_id } : {}),
            ...(filter.actor_id ? { actor_id: filter.actor_id } : {}),
            ...(filter.action ? { action: filter.action } : {}),
            ...(filter.date_from ? { date_from: filter.date_from } : {}),
            ...(filter.date_to ? { date_to: filter.date_to } : {}),
          },
        },
      )
      auditsCollection.value = response.payload
    } finally {
      loading.value = false
    }
  }

  return {
    auditsCollection,
    loading,
    getAllPaginated,
  }
}
