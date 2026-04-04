import type { ResponseData, ResponseError, ResponseSingleData } from '~/types/response'
import type User from '~/types/entities/user'
import { useAuthStore } from '~/stores/auth'
import { isFetchResponseError } from '~/utils/helper'
import { ResponseCode } from '~/layouts/ResponseCode'

export interface AuthRequest {
  email: string
  password: string
}

export const useAuthService = () => {
  const { $api } = useNuxtApp()
  const responseError = ref<ResponseError | null>(null)

  const { setAuthenticatedUser, setUnauthenticatedUser } = useAuthStore()

  const authenticate = async (request: AuthRequest) => {
    try {
      const response: ResponseSingleData<User> = await $api('api/auth/authenticate', {
        method: 'POST',
        body: request,
        credentials: 'include',
      })

      await setAuthenticatedUser(response.payload.data)
      navigateTo('/')
    } catch (e) {
      console.log(e)
    }
  }

  const logout = async () => {
    try {
      const accessToken = useCookie('access_token').value
      if (accessToken) {
        const response = await $api<ResponseData>('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
        await setUnauthenticatedUser()
        navigateTo('/auth')
        return
      } else {
        await setUnauthenticatedUser()
        navigateTo('/auth')
        return
      }
    } catch (e) {
      if (isFetchResponseError(e)) {
        const error = e._data as ResponseError
        if (error.code === ResponseCode.ERR_ACTION_UNAUTHORIZED) {
          await setUnauthenticatedUser()
          navigateTo('/auth')
        }
      }
    }
  }

  return {
    authenticate,
    logout,
    responseError,
  }
}
