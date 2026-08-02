import type { ResponseData, ResponseError, ResponseSingleData } from '~/types/response'
import type User from '~/types/entities/user'
import type { AuthUser } from '~/types/entities/user'
import { useAuthStore } from '~/stores/auth'

export interface AuthRequest {
  email: string
  password: string
}

export const useAuthService = () => {
  const { $api } = useNuxtApp()
  const responseError = ref<ResponseError | null>(null)
  const submitting = ref(false)

  const { setAuthenticatedUser, setUser, setUnauthenticatedUser } = useAuthStore()

  const authenticate = async (request: AuthRequest): Promise<boolean> => {
    submitting.value = true
    try {
      const response: ResponseSingleData<AuthUser> = await $api('api/auth/authenticate', {
        method: 'POST',
        body: request,
      })

      await setAuthenticatedUser(response.payload.data)
      await navigateTo('/')
      return true
    } catch (e) {
      // validation/error messages are already surfaced via the $api plugin's flash store handling
      responseError.value = (e as { _data?: ResponseError })?._data ?? null
      return false
    } finally {
      submitting.value = false
    }
  }

  const fetchMe = async () => {
    const response: ResponseSingleData<User> = await $api('api/auth/me', {
      method: 'GET',
    })
    await setUser(response.payload.data)
  }

  /**
   * Manual refresh. The $api plugin already refreshes transparently on a 401,
   * so this is only for explicit calls (e.g. a "keep me signed in" timer).
   */
  const refresh = async () => {
    const response: ResponseSingleData<AuthUser> = await $api('api/auth/refresh', {
      method: 'POST',
    })
    await setAuthenticatedUser(response.payload.data)
  }

  const logout = async () => {
    try {
      if (useCookie('access_token').value) {
        await $api<ResponseData>('api/auth/logout', {
          method: 'POST',
        })
      }
    } catch {
      // ignore failures - local session is cleared below regardless of API outcome
    } finally {
      await setUnauthenticatedUser()
      await navigateTo('/auth')
    }
  }

  return {
    authenticate,
    logout,
    fetchMe,
    refresh,
    responseError,
    submitting,
  }
}