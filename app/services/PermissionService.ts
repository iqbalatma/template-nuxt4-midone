import type { ResponseDataCollectionWithoutPagination } from '~/types/response'
import type Permission from '~/types/entities/permission'

export const usePermissionService = () => {
  const { $api } = useNuxtApp()
  const permissionsCollection = ref<Permission[]>([])
  const getAll = async () => {
    try {
      const response = await $api<ResponseDataCollectionWithoutPagination<Permission>>(
        'api/management/permissions',
        {
          method: 'GET',
        },
      )
      permissionsCollection.value = response.payload.data
    } catch (e) {
      console.log(e)
    }
  }

  return {
    permissionsCollection,
    getAll,
  }
}
