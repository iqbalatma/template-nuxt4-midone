import type { ResponseData, ResponseError, ResponseSingleData } from '~/types/response'
import type User from '~/types/entities/user'
import { useAuthStore } from '~/stores/auth'
import { isFetchResponseError } from '~/utils/helper'
import { ResponseCode } from '~/enums/ResponseCode'

export interface AuthRequest {
  username: string
  password: string
}

export const useAuthService = () => {
  const { $api } = useNuxtApp()
  const responseError = ref<ResponseError | null>(null)

  const { setAuthenticatedUser, setUnauthenticatedUser } = useAuthStore()

  const authenticate = async (request: AuthRequest) => {
    try {
      console.log(request)
      const response: ResponseSingleData<{ token: string; user: User }> = await $api(
        'api/auth/login',
        {
          method: 'POST',
          body: request,
        },
      )

      console.log(response)

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
        await $api<ResponseData>('/api/auth/logout', {
          method: 'POST',
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
