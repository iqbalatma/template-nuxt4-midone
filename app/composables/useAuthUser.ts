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

  /**
   * Absolute URL of the avatar, or '' when there is none - the store may hold
   * the thinner `AuthProfile` from login, which carries no avatar at all.
   * `thumb` (150px) is what every avatar in the chrome renders at; the original
   * is only worth downloading on a page that shows it large.
   *
   * media.Resource URLs are root-relative and served by the API host, so they
   * need `apiBase` in front of them or the browser asks this app for a file it
   * does not have.
   */
  const avatarUrl = computed(() => {
    const avatar = user.value && 'avatar' in user.value ? user.value.avatar : null
    const path = avatar?.conversions?.['thumb'] ?? avatar?.url
    if (!path) return ''
    return `${useRuntimeConfig().public.apiBase}${path}`
  })

  const roles = computed(() =>
    user.value && 'roles' in user.value ? (user.value.roles ?? []) : [],
  )
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
    avatarUrl,
    roles,
    roleNames,
    primaryRole,
    initials,
    isAuthenticated,
  }
}
