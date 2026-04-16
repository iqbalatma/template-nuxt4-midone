import { useFlashStore } from '~/stores/flash'
import type User from '~/types/entities/user'
import type {
  PayloadDataCollectionPaginated,
  ResponseData,
  ResponseDataCollectionWithPagination,
  ResponseSingleData,
} from '~/types/response'
import { createDefaultPaginated } from '~/utils/helper'
import type Role from '~/types/entities/role'
import type { RoleRequest } from '~/services/RoleService'

export interface UserRequest {
  id: string | null
  first_name: string
  last_name: string|null
  email: string
  role_ids: string[]
}
export const userUserService = ()=>{
  const { $api } = useNuxtApp()
  const usersCollection = ref<PayloadDataCollectionPaginated<User>>(createDefaultPaginated())
  const flashStore = useFlashStore()

  const getAllPaginated = async () => {
    const response = await $api<ResponseDataCollectionWithPagination<User>>(
      'api/management/users',
      {
        method: 'GET',
      },
    )

    usersCollection.value = response.payload
  }

  const addNew = async (request: UserRequest) => {
    const response = await $api<ResponseSingleData<User>>('api/management/users', {
      method: 'POST',
      body: request,
    })
    flashStore.setSuccess(response)
  }


  const deleteById = async (id: string) => {
    const response = await $api<ResponseData>(`api/management/users/${id}`, {
      method: 'DELETE',
    })
    flashStore.setSuccess(response)
  }

  return {
    usersCollection,
    getAllPaginated,
    deleteById,
    addNew,
  }
}
