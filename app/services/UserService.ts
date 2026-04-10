import { useFlashStore } from '~/stores/flash'
import type User from '~/types/entities/user'
import type {
  PayloadDataCollectionPaginated,
  ResponseDataCollectionWithPagination,
} from '~/types/response'
import { createDefaultPaginated } from '~/utils/helper'

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

  return {
    usersCollection,
    getAllPaginated
  }
}
