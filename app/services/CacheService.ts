import { useFlashStore } from '~/stores/flash'
import type { ResponseData, ResponseDataCollectionWithoutPagination } from '~/types/response'

/** Mirrors `utils.CacheEntry` in the Go API. */
export interface CacheEntry {
  key: string
  count: number
  expires_in_seconds: number
}

export const useCacheService = () => {
  const { $api } = useNuxtApp()
  const flashStore = useFlashStore()

  const entries = ref<CacheEntry[]>([])
  const loading = ref(false)
  // Holds the key currently being cleared so only that row shows a busy state;
  // '' is the clear-everything button.
  const clearingKey = ref<string | null>(null)

  const getAll = async () => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithoutPagination<CacheEntry>>(
        'api/management/cache',
        { method: 'GET' },
      )
      entries.value = response.payload.data
    } finally {
      loading.value = false
    }
  }

  /**
   * No key clears everything - the API matches the key as a prefix, so an empty
   * one matches all of them. That is also why there is no separate "clear all"
   * endpoint.
   */
  const clear = async (key = ''): Promise<boolean> => {
    clearingKey.value = key
    try {
      const response = await $api<ResponseData>('api/management/cache', {
        method: 'DELETE',
        query: key ? { key } : undefined,
      })
      flashStore.setSuccess(response)
      return true
    } catch {
      return false
    } finally {
      clearingKey.value = null
    }
  }

  return {
    entries,
    loading,
    clearingKey,
    getAll,
    clear,
  }
}
