import type { ResponseDataCollectionWithoutPagination } from '~/types/response'
import type Role from '~/types/entities/role'

export const useRoleService = () => {
  const { $api } = useNuxtApp()
  const rolesCollection = ref<Role[]>([])
  const getAllData = async () => {
    try {
      const response = await $api<ResponseDataCollectionWithoutPagination<Role>>('api/management/roles', {
        method: 'GET',
      })

      rolesCollection.value = response.payload.data
    } catch (e) {
      console.log(e)
    }
  }

  return {
    rolesCollection,
    getAllData
  }
}
