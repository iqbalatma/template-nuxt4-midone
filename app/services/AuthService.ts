import type { ResponseData, ResponseError, ResponseSingleData } from '~/types/response'
import type { AuthUser, Profile } from '~/types/entities/user'
import { useAuthStore } from '~/stores/auth'

export interface AuthRequest {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  password_confirm: string
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

      // Login returns the profile but no roles or permissions, and the menu is
      // built from permissions - without this the user lands on a dashboard
      // with every gated entry hidden until the next full page load.
      await fetchMe()

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

  /**
   * The route is `/api/me`, not `/api/auth/me` - it is the user acting on
   * itself, and the id always comes from the token. It is also the only
   * endpoint that returns `permissions`, so the menu stays unfiltered until
   * this has run at least once.
   */
  const fetchMe = async () => {
    const response: ResponseSingleData<Profile> = await $api('api/me', {
      method: 'GET',
    })
    await setUser(response.payload.data)
    return response.payload.data
  }

  /**
   * Mints a token scoped to the WebSocket routes. A browser handshake cannot
   * send an Authorization header, so the token has to travel in the URL - and a
   * token in a URL should not also work as a general bearer credential. The API
   * refuses this one everywhere except the WS routes.
   */
  const wsToken = async (): Promise<string | null> => {
    try {
      const response: ResponseSingleData<{ access_token: string }> = await $api(
        'api/auth/ws-token',
        { method: 'POST' },
      )
      return response.payload.data.access_token
    } catch {
      return null
    }
  }

  /**
   * Full-page redirect rather than $api: the OAuth flow is a browser
   * navigation, and the callback redirects back to /auth/callback with the
   * token in the query string.
   */
  const loginWithGoogle = () => {
    const config = useRuntimeConfig()
    window.location.href = `${config.public.apiBase}/api/auth/google/redirect`
  }

  /**
   * Asks for a reset link. The API answers the same way whether or not the
   * address exists - do not add a "no such account" message here, it would put
   * the enumeration back that the API deliberately avoids.
   */
  const forgotPassword = async (request: ForgotPasswordRequest): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseData>('api/auth/forgot-password', {
        method: 'POST',
        body: request,
      })
      useFlashStore().setSuccess(response)
      return true
    } catch (e) {
      responseError.value = (e as { _data?: ResponseError })?._data ?? null
      return false
    } finally {
      submitting.value = false
    }
  }

  const resetPassword = async (request: ResetPasswordRequest): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseData>('api/auth/reset-password', {
        method: 'POST',
        body: request,
      })
      useFlashStore().setSuccess(response)
      await navigateTo('/auth')
      return true
    } catch (e) {
      responseError.value = (e as { _data?: ResponseError })?._data ?? null
      return false
    } finally {
      submitting.value = false
    }
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
    wsToken,
    loginWithGoogle,
    forgotPassword,
    resetPassword,
    responseError,
    submitting,
  }
}