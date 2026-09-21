import type {
  ResponseData,
  ResponseDataCollectionWithoutPagination,
  ResponseSingleData,
} from '~/types/response'
import type M2MClient from '~/types/entities/m2m_client'
import { useFlashStore } from '~/stores/flash'

export interface M2MClientRequest {
  client: string
  scope: string[]
}

/**
 * The create and regenerate responses only: the plaintext secret is generated
 * server-side once and is not recoverable afterwards, so whatever renders this
 * is the one and only chance to show it.
 */
export interface M2MClientCreated extends M2MClient {
  secret: string
}

export const useM2MClientService = () => {
  const { $api } = useNuxtApp()
  const clientsCollection = ref<M2MClient[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const flashStore = useFlashStore()

  const getAll = async () => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithoutPagination<M2MClient>>(
        'api/management/m2m-clients',
        { method: 'GET' },
      )
      clientsCollection.value = response.payload.data
    } finally {
      loading.value = false
    }
  }

  const addNew = async (request: M2MClientRequest): Promise<M2MClientCreated | null> => {
    submitting.value = true
    try {
      const response = await $api<ResponseSingleData<M2MClientCreated>>(
        'api/management/m2m-clients',
        { method: 'POST', body: request },
      )
      flashStore.setSuccess(response)
      return response.payload.data
    } catch {
      // the $api plugin already pushed the error into the flash store
      return null
    } finally {
      submitting.value = false
    }
  }

  const updateById = async (id: string, request: M2MClientRequest): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseSingleData<M2MClient>>(
        `api/management/m2m-clients/${id}`,
        { method: 'PATCH', body: request },
      )
      flashStore.setSuccess(response)
      return true
    } catch {
      return false
    } finally {
      submitting.value = false
    }
  }

  const regenerateSecret = async (id: string): Promise<M2MClientCreated | null> => {
    submitting.value = true
    try {
      const response = await $api<ResponseSingleData<M2MClientCreated>>(
        `api/management/m2m-clients/${id}/regenerate-secret`,
        { method: 'POST' },
      )
      flashStore.setSuccess(response)
      return response.payload.data
    } catch {
      return null
    } finally {
      submitting.value = false
    }
  }

  /** Revoke, not delete — the API keeps the row and stamps revoked_at. */
  const revokeById = async (id: string): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseData>(`api/management/m2m-clients/${id}`, {
        method: 'DELETE',
      })
      flashStore.setSuccess(response)
      return true
    } catch {
      return false
    } finally {
      submitting.value = false
    }
  }

  return {
    clientsCollection,
    loading,
    submitting,
    getAll,
    addNew,
    updateById,
    regenerateSecret,
    revokeById,
  }
}
