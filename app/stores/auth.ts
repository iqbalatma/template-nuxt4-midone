import type User from '~/types/entities/user'
import type { AuthProfile, AuthUser, Profile } from '~/types/entities/user'

const USER_STORAGE_KEY = 'auth_user'

export const useAuthStore = defineStore('authStore', () => {
  // Restored from localStorage so a reload draws the correct menu immediately,
  // instead of hiding every permission-gated entry until fetchMe resolves.
  const storedUser = import.meta.client ? localStorage.getItem(USER_STORAGE_KEY) : null
  const user = ref<User | AuthProfile | Profile | null>(storedUser ? JSON.parse(storedUser) : null)

  const accessToken = useCookie('access_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: false,
    watch: true,
  })

  const persist = () => {
    if (!import.meta.client) return
    if (user.value) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user.value))
    else localStorage.removeItem(USER_STORAGE_KEY)
  }

  const roleNames = computed(() =>
    user.value && 'roles' in user.value ? (user.value.roles ?? []).map((role) => role.name) : [],
  )

  /** Case-insensitive: backend role names are free text and mixed case. */
  const hasRole = (...names: string[]) =>
    names.some((name) => roleNames.value.some((role) => role.toLowerCase() === name.toLowerCase()))

  /**
   * Only /api/me returns `permissions`, so this is empty until fetchMe has run
   * once. It is a rendering hint, never a security boundary - the API gates
   * every route on its own with middleware.RequirePermission.
   */
  const permissionNames = computed(() =>
    user.value && 'permissions' in user.value ? (user.value.permissions ?? []) : [],
  )

  const hasPermission = (...names: string[]) =>
    names.some((name) => permissionNames.value.includes(name))

  const setAuthenticatedUser = async (authUser: AuthUser): Promise<void> => {
    const { tokens, ...profile } = authUser
    // Login returns no roles or permissions. Keep whatever fetchMe already put
    // there so a token refresh mid-session cannot blank the menu.
    const existing = user.value
    user.value =
      existing && 'permissions' in existing && existing.id === profile.id
        ? { ...existing, ...profile }
        : profile
    accessToken.value = tokens.access_token
    persist()
  }

  /**
   * Sets only the token. The OAuth callback lands with a token and nothing
   * else, so the profile is fetched separately right after.
   */
  const setAccessToken = (token: string): void => {
    accessToken.value = token
  }

  const setUser = async (profile: User | Profile): Promise<void> => {
    user.value = profile
    persist()
  }

  const setUnauthenticatedUser = async () => {
    accessToken.value = null
    user.value = null
    persist()
  }

  return {
    user,
    accessToken,
    roleNames,
    permissionNames,
    hasRole,
    hasPermission,
    setAuthenticatedUser,
    setAccessToken,
    setUser,
    setUnauthenticatedUser,
  }
})
