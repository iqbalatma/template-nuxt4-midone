import type JobLog from '~/types/entities/job_log'
import type { JobDefinition } from '~/types/entities/job_log'
import type {
  PayloadDataCollectionPaginated,
  ResponseDataCollectionWithPagination,
  ResponseDataCollectionWithoutPagination,
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
   * The registered jobs, not their runs. Static server-side - it mirrors what
   * main.go wired into the scheduler, so a job that never ran still appears.
   */
  const getDefinitions = async () => {
    const response = await $api<ResponseDataCollectionWithoutPagination<JobDefinition>>(
      'api/management/job-logs/definitions',
      { method: 'GET' },
    )
    definitions.value = response.payload.data
  }

  return {
    logsCollection,
    definitions,
    loading,
    getAllPaginated,
    getDefinitions,
  }
}
