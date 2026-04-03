import type { ResponseError, ResponseSingleData } from '~/types/response'
import type User from '~/types/entities/user'
import { useAuthStore } from '~/stores/auth'
export interface AuthRequest {
  email: string
  password: string
}

export const useAuthService = () => {
  const { $api } = useNuxtApp()
  const responseError = ref<ResponseError | null>(null)

  const { setAuthenticatedUser } = useAuthStore()

  const authenticate = async (request: AuthRequest) => {
    try {
      const response: ResponseSingleData<User> = await $api('api/auth/authenticate', {
        method: 'POST',
        body: request,
        credentials: 'include',
      })

      await setAuthenticatedUser(response.payload.data)
      navigateTo("/")
    } catch (e) {
      console.log(e)
    }
  }

  return {
    authenticate,
    responseError,
  }
}
