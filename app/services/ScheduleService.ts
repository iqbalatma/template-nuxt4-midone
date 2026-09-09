import { useFlashStore } from '~/stores/flash'
import type ScheduledJob from '~/types/entities/scheduled_job'
import type { ResponseDataCollectionWithoutPagination, ResponseSingleData } from '~/types/response'

export interface ScheduleUpdatePayload {
  cron_expression: string
  enabled: boolean
}

export const useScheduleService = () => {
  const { $api } = useNuxtApp()
  const flashStore = useFlashStore()

  const schedules = ref<ScheduledJob[]>([])
  const loading = ref(false)
  const actingId = ref<string | null>(null)

  /**
   * Unpaginated, like the API: the list is one row per job registered in code,
   * and paging it would hide the one thing the screen is for.
   */
  const getAll = async () => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithoutPagination<ScheduledJob>>(
        'api/management/schedules',
        { method: 'GET' },
      )
      schedules.value = response.payload.data
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string, payload: ScheduleUpdatePayload): Promise<boolean> => {
    actingId.value = id
    try {
      const response = await $api<ResponseSingleData<ScheduledJob>>(
        `api/management/schedules/${id}`,
        {
          method: 'PATCH',
          body: payload,
        },
      )
      flashStore.setSuccess(response)
      return true
    } catch {
      // An invalid cron expression comes back as a per-field error the form
      // renders under the input; the plugin has already flashed the message.
      return false
    } finally {
      actingId.value = null
    }
  }

  /**
   * Triggers a run. The API answers "accepted", not "finished" — the job runs
   * on the scheduler's own goroutine, so the outcome arrives over the job-logs
   * feed a moment later rather than in this response.
   */
  const runNow = async (id: string): Promise<boolean> => {
    actingId.value = id
    try {
      const response = await $api<ResponseSingleData<ScheduledJob>>(
        `api/management/schedules/${id}/run`,
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

  return { schedules, loading, actingId, getAll, update, runNow }
}
