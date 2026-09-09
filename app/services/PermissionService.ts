import type { ResponseDataCollectionWithoutPagination } from '~/types/response'
import type Permission from '~/types/entities/permission'

export const usePermissionService = () => {
  const { $api } = useNuxtApp()
  const permissionsCollection = ref<Permission[]>([])
  const permissionOptionsCollection = ref<Permission[]>([])
  const loading = ref(false)

  /** Backing data for the permissions listing page */
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

  /** Lookup list for form inputs (e.g. picking permissions on a role) */
  const getAllOptions = async () => {
    const response = await $api<ResponseDataCollectionWithoutPagination<Permission>>(
      'api/options/permissions',
      { method: 'GET' },
    )
    permissionOptionsCollection.value = response.payload.data
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
    permissionOptionsCollection,
    permissionsByGroup,
    loading,
    getAll,
    getAllOptions,
  }
}