import type {
  ResponseData,
  ResponseDataCollectionWithoutPagination,
  ResponseSingleData,
} from '~/types/response'
import type Role from '~/types/entities/role'
import type { RoleOption } from '~/types/entities/role'
import { useFlashStore } from '~/stores/flash'

export interface RoleRequest {
  name: string
  description: string | null
  permission_ids: string[]
}

export const useRoleService = () => {
  const { $api } = useNuxtApp()
  const rolesCollection = ref<Role[]>([])
  const roleOptionsCollection = ref<RoleOption[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const flashStore = useFlashStore()

  const getAll = async () => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithoutPagination<Role>>('api/rbac/roles', {
        method: 'GET',
      })
      rolesCollection.value = response.payload.data
    } finally {
      loading.value = false
    }
  }

  /** Trimmed id/name list, for select inputs (e.g. assigning roles to a user) */
  const getAllOptions = async () => {
    const response = await $api<ResponseDataCollectionWithoutPagination<RoleOption>>(
      'api/options/roles',
      { method: 'GET' },
    )
    roleOptionsCollection.value = response.payload.data
  }

  const addNew = async (request: RoleRequest): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseSingleData<Role>>('api/rbac/roles', {
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

  const updateById = async (id: string, request: RoleRequest): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseSingleData<Role>>(`api/rbac/roles/${id}`, {
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
      const response = await $api<ResponseData>(`api/rbac/roles/${id}`, {
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
    rolesCollection,
    roleOptionsCollection,
    loading,
    submitting,
    getAll,
    getAllOptions,
    addNew,
    updateById,
    deleteById,
  }
}