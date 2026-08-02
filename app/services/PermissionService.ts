import type { ResponseDataCollectionWithoutPagination } from '~/types/response'
import type Permission from '~/types/entities/permission'

export const usePermissionService = () => {
  const { $api } = useNuxtApp()
  const permissionsCollection = ref<Permission[]>([])
  const loading = ref(false)

  const getAll = async () => {
    loading.value = true
    try {
      const response = await $api<ResponseDataCollectionWithoutPagination<Permission>>(
        'api/rbac/permissions',
        {
          method: 'GET',
        },
      )
      permissionsCollection.value = response.payload.data
    } finally {
      loading.value = false
    }
  }

  /** Permissions bucketed by their `group` column, for grouped checkbox lists */
  const permissionsByGroup = computed<Record<string, Permission[]>>(() =>
    permissionsCollection.value.reduce(
      (groups, permission) => {
        const key = permission.group || 'Other'
        ;(groups[key] ??= []).push(permission)
        return groups
      },
      {} as Record<string, Permission[]>,
    ),
  )

  return {
    permissionsCollection,
    permissionsByGroup,
    loading,
    getAll,
  }
}