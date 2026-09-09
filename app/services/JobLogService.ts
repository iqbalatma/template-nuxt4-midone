import type JobLog from '~/types/entities/job_log'
import type { JobDefinition, JobStats, JobStatsRange } from '~/types/entities/job_log'
import type {
  PayloadDataCollectionPaginated,
  ResponseDataCollectionWithPagination,
  ResponseDataCollectionWithoutPagination,
  ResponseSingleData,
} from '~/types/response'
import { createDefaultPaginated } from '~/utils/helper'

export interface JobLogFilter {
  page?: number
  per_page?: number
  type?: string
  name?: string
  status?: string
}

export const useJobLogService = () => {
  const { $api } = useNuxtApp()
  const logsCollection = ref<PayloadDataCollectionPaginated<JobLog>>(createDefaultPaginated())
  const definitions = ref<JobDefinition[]>([])
  const stats = ref<JobStats | null>(null)
  const loading = ref(false)

  const getAllPaginated = async (filter: JobLogFilter = {}) => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithPagination<JobLog>>(
        'api/management/job-logs',
        {
          method: 'GET',
          query: {
            page: filter.page ?? 1,
            per_page: filter.per_page ?? 10,
            ...(filter.type ? { type: filter.type } : {}),
            ...(filter.name ? { name: filter.name } : {}),
            ...(filter.status ? { status: filter.status } : {}),
          },
        },
      )
      logsCollection.value = response.payload
    } finally {
      loading.value = false
    }
  }

  /**
   * The jobs that can appear in this table, not their runs — derived on the API
   * from the scheduler's registrations plus the queue's handlers, so a job that
   * has never run is still offered as a filter and its empty list is a real
   * answer.
   */
  const getDefinitions = async () => {
    const response = await $api<ResponseDataCollectionWithoutPagination<JobDefinition>>(
      'api/management/job-logs/definitions',
      { method: 'GET' },
    )
    definitions.value = response.payload.data
  }

  /**
   * Run analytics over a fixed window. The range keys are the API's, not a free
   * start/end pair: each one carries its own bucket size, so letting the client
   * pick an arbitrary window would mean picking that size here too.
   */
  const getStats = async (range: JobStatsRange = '24h', type = '') => {
    const response = await $api<ResponseSingleData<JobStats>>('api/management/job-logs/stats', {
      method: 'GET',
      query: { range, ...(type ? { type } : {}) },
    })
    stats.value = response.payload.data
  }

  return {
    logsCollection,
    definitions,
    stats,
    loading,
    getAllPaginated,
    getDefinitions,
    getStats,
  }
}
