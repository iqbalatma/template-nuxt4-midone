import { useAuthService } from '~/services/AuthService'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const accessToken = useCookie('access_token')

  if (accessToken.value && !authStore.user) {
    const { fetchMe } = useAuthService()
    try {
      await fetchMe()
    } catch (e) {
      // invalid/expired token - the $api plugin already clears the session on ERR_ACTION_UNAUTHORIZED
    }
  }
})