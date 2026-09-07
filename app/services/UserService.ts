import { useFlashStore } from '~/stores/flash'
import type User from '~/types/entities/user'
import type {
  PayloadDataCollectionPaginated,
  ResponseData,
  ResponseDataCollectionWithPagination,
  ResponseSingleData,
} from '~/types/response'
import { createDefaultPaginated } from '~/utils/helper'

/** POST accepts a password; PATCH does not (see user.StoreRequest / UpdateRequest in Go) */
export interface UserRequest {
  first_name: string
  last_name: string | null
  email: string
  phone_number: string | null
  password?: string
  role_ids: string[]
}

export interface UserFilter {
  page?: number
  per_page?: number
  /** Matches first name, last name or email (see user.Repository.GetAllPaginated). */
  search?: string
}

export const useUserService = () => {
  const { $api } = useNuxtApp()
  const usersCollection = ref<PayloadDataCollectionPaginated<User>>(createDefaultPaginated())
  const loading = ref(false)
  const submitting = ref(false)
  const flashStore = useFlashStore()

  const getAllPaginated = async (filter: UserFilter = {}) => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithPagination<User>>(
        'api/management/users',
        {
          method: 'GET',
          query: {
            page: filter.page ?? 1,
            per_page: filter.per_page ?? 10,
            // Left off entirely when empty: the API treats a blank search as
            // no filter, and an empty param would still land in the URL.
            search: filter.search || undefined,
          },
        },
      )
      usersCollection.value = response.payload
    } finally {
      loading.value = false
    }
  }

  const addNew = async (request: UserRequest): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseSingleData<User>>('api/management/users', {
        method: 'POST',
        body: request,
      })
      flashStore.setSuccess(response)
      return true
    } catch {
      // the $api plugin already pushed the error into the flash store
      return false
    } finally {
      submitting.value = false
    }
  }

  const updateById = async (id: string, request: UserRequest): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseSingleData<User>>(`api/management/users/${id}`, {
        method: 'PATCH',
        body: request,
      })
      flashStore.setSuccess(response)
      return true
    } catch {
      return false
    } finally {
      submitting.value = false
    }
  }

  const deleteById = async (id: string): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseData>(`api/management/users/${id}`, {
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
    usersCollection,
    loading,
    submitting,
    getAllPaginated,
    addNew,
    updateById,
    deleteById,
  }
}