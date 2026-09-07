import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

/**
 * Presentation-level view of the authenticated user, normalising the two shapes
 * the store can hold: the `AuthProfile` from authenticate/refresh (has
 * `full_name`, no `roles`) and the fuller `User` from /auth/me (has `roles`,
 * no `full_name`).
 */
export const useAuthUser = () => {
  const { user } = storeToRefs(useAuthStore())

  const fullName = computed(() => {
    const current = user.value
    if (!current) return ''
    if ('full_name' in current && current.full_name) return current.full_name
    return [current.first_name, current.last_name].filter(Boolean).join(' ')
  })

  const email = computed(() => user.value?.email ?? '')
  const phoneNumber = computed(() => user.value?.phone_number ?? '')

  const roles = computed(() => (user.value && 'roles' in user.value ? (user.value.roles ?? []) : []))
  const roleNames = computed(() => roles.value.map((role) => role.name))

  // Used wherever there is only room for a single line of role text
  const primaryRole = computed(() => roleNames.value[0] ?? '')

  const initials = computed(() => {
    const current = user.value
    if (!current) return ''

    const first = current.first_name?.trim() ?? ''
    const last = current.last_name?.trim() ?? ''

    if (first && last) return (first[0]! + last[0]!).toUpperCase()
    if (first) return first.slice(0, 2).toUpperCase()
    return current.email.slice(0, 2).toUpperCase()
  })

  const isAuthenticated = computed(() => user.value !== null)

  return {
    user,
    fullName,
    email,
    phoneNumber,
    roles,
    roleNames,
    primaryRole,
    initials,
    isAuthenticated,
  }
}