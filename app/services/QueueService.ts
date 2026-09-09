import { useFlashStore } from '~/stores/flash'
import type QueueJob from '~/types/entities/queue_job'
import type { QueueJobStatus, QueueStats } from '~/types/entities/queue_job'
import type {
  PayloadDataCollectionPaginated,
  ResponseDataCollectionWithPagination,
  ResponseSingleData,
} from '~/types/response'
import { createDefaultPaginated } from '~/utils/helper'

export interface QueueJobFilter {
  page?: number
  per_page?: number
  queue?: string
  name?: string
  status?: string
}

/** The statuses the API accepts for a purge — a running or pending job cannot be deleted. */
export type PurgeableStatus = Extract<QueueJobStatus, 'success' | 'failed' | 'canceled'>

export const useQueueService = () => {
  const { $api } = useNuxtApp()
  const flashStore = useFlashStore()

  const jobsCollection = ref<PayloadDataCollectionPaginated<QueueJob>>(createDefaultPaginated())
  const stats = ref<QueueStats | null>(null)
  const loading = ref(false)
  /** The job currently being acted on, so only that row shows a busy state. */
  const actingId = ref<string | null>(null)

  const getAllPaginated = async (filter: QueueJobFilter = {}) => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithPagination<QueueJob>>(
        'api/management/queue/jobs',
        {
          method: 'GET',
          query: {
            page: filter.page ?? 1,
            per_page: filter.per_page ?? 10,
            // Empty filters are dropped rather than sent blank: the API treats
            // a present-but-empty value as a filter matching nothing.
            ...(filter.queue ? { queue: filter.queue } : {}),
            ...(filter.name ? { name: filter.name } : {}),
            ...(filter.status ? { status: filter.status } : {}),
          },
        },
      )
      jobsCollection.value = response.payload
    } finally {
      loading.value = false
    }
  }

  const getStats = async () => {
    const response = await $api<ResponseSingleData<QueueStats>>('api/management/queue/stats', {
      method: 'GET',
    })
    stats.value = response.payload.data
  }

  const retry = async (id: string): Promise<boolean> => {
    actingId.value = id
    try {
      const response = await $api<ResponseSingleData<QueueJob>>(
        `api/management/queue/jobs/${id}/retry`,
        { method: 'POST' },
      )
      flashStore.setSuccess(response)
      return true
    } catch {
      return false
    } finally {
      actingId.value = null
    }
  }

  const cancel = async (id: string): Promise<boolean> => {
    actingId.value = id
    try {
      const response = await $api<ResponseSingleData<QueueJob>>(
        `api/management/queue/jobs/${id}/cancel`,
        { method: 'POST' },
      )
      flashStore.setSuccess(response)
      return true
    } catch {
      return false
    } finally {
      actingId.value = null
    }
  }

  /** Requeues every failed job, or every failed job of one name. */
  const retryFailed = async (name = ''): Promise<boolean> => {
    try {
      const response = await $api<ResponseSingleData<{ requeued: number }>>(
        'api/management/queue/jobs/retry-failed',
        { method: 'POST', body: name ? { name } : {} },
      )
      flashStore.setSuccess(response)
      return true
    } catch {
      return false
    }
  }

  const purge = async (statuses: PurgeableStatus[]): Promise<boolean> => {
    try {
      const response = await $api<ResponseSingleData<{ deleted: number }>>(
        'api/management/queue/jobs',
        {
          method: 'DELETE',
          body: { statuses },
        },
      )
      flashStore.setSuccess(response)
      return true
    } catch {
      return false
    }
  }

  return {
    jobsCollection,
    stats,
    loading,
    actingId,
    getAllPaginated,
    getStats,
    retry,
    cancel,
    retryFailed,
    purge,
  }
}
