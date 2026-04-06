import type {
  ResponseData,
  ResponseDataCollectionWithoutPagination,
  ResponseSingleData,
} from '~/types/response'
import type Role from '~/types/entities/role'
import { useFlashStore } from '~/stores/flash'

export interface RoleRequest {
  id: string | null
  name: string
  is_mutable: boolean
  permission_ids: string[]
}

export const useRoleService = () => {
  const { $api } = useNuxtApp()
  const rolesCollection = ref<Role[]>([])
  const flashStore = useFlashStore()
  const getAll = async () => {
    const response = await $api<ResponseDataCollectionWithoutPagination<Role>>(
      'api/management/roles',
      {
        method: 'GET',
      },
    )

    rolesCollection.value = response.payload.data
  }

  const addNew = async (request: RoleRequest) => {
    const response = await $api<ResponseSingleData<Role>>('api/management/roles', {
      method: 'POST',
      body: request,
    })
    flashStore.setSuccess(response)
  }

  const updateById = async (id: string, request: RoleRequest) => {
    const response = await $api<ResponseSingleData<Role>>(`api/management/roles/${id}`, {
      method: 'PATCH',
      body: request,
    })
    flashStore.setSuccess(response)
  }

  const deleteById = async (id: string) => {
    const response = await $api<ResponseData>(`api/management/roles/${id}`, {
      method: 'DELETE',
    })
    flashStore.setSuccess(response)
  }

  return {
    rolesCollection,
    getAll,
    updateById,
    deleteById,
    addNew,
  }
}
