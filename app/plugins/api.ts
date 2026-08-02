import type { RuntimeConfig } from 'nuxt/schema'
import type { FetchResponse } from 'ofetch'
import type { ResponseError, ResponseSingleData } from '~/types/response'
import type { AuthUser } from '~/types/entities/user'
import { useFlashStore } from '~/stores/flash'
import { ResponseCode } from '~/enums/ResponseCode'

/**
 * Endpoints that must never trigger the refresh flow. A 401 coming from these
 * means the credentials themselves are wrong (or the refresh cookie is gone),
 * so retrying with a new token would just loop.
 */
const NO_REFRESH_ENDPOINTS = ['api/auth/authenticate', 'api/auth/refresh', 'api/auth/logout']

/** The options bag $fetch itself accepts, so callers keep full autocompletion */
export type ApiOptions = NonNullable<Parameters<typeof $fetch>[1]>

// Module scope so every $api call in the page session shares the same refresh state
let isRefreshing = false
let pendingRequests: Array<(token: string | null) => void> = []

const flushPending = (token: string | null) => {
  pendingRequests.forEach((resume) => resume(token))
  pendingRequests = []
}

export default defineNuxtPlugin(() => {
  const config: RuntimeConfig = useRuntimeConfig()

  const buildHeaders = (token: string | null, extra?: HeadersInit): HeadersInit => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
    ...((extra as Record<string, string>) ?? {}),
  })

  /**
   * Hits the refresh endpoint with a bare $fetch so it never re-enters this
   * wrapper. The backend reads the httpOnly `refresh_token` cookie, so no
   * Authorization header is needed here - only `credentials: include`.
   */
  const tryRefresh = async (): Promise<string | null> => {
    try {
      const response = await $fetch<ResponseSingleData<AuthUser>>('api/auth/refresh', {
        baseURL: config.public.apiBase,
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      })

      const authUser = response.payload.data
      if (!authUser?.tokens?.access_token) return null

      await useAuthStore().setAuthenticatedUser(authUser)
      return authUser.tokens.access_token
    } catch {
      return null
    }
  }

  const forceLogout = async () => {
    await useAuthStore().setUnauthenticatedUser()
    await navigateTo('/auth')
  }

  const reportError = (response?: FetchResponse<ResponseError>) => {
    const flashStore = useFlashStore()
    flashStore.clearMessages()
    if (response?._data) flashStore.setFailed(response._data)
  }

  const api = async <T = unknown>(url: string, options: ApiOptions = {}): Promise<T> => {
    const buildOptions = (token: string | null): ApiOptions => ({
      ...options,
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: buildHeaders(token, options.headers as HeadersInit),
    })

    try {
      return await $fetch<T>(url, buildOptions(useCookie('access_token').value ?? null))
    } catch (error: unknown) {
      const response = (error as { response?: FetchResponse<ResponseError> })?.response
      const isRefreshable =
        response?.status === 401 && !NO_REFRESH_ENDPOINTS.some((path) => url.includes(path))

      if (!isRefreshable) {
        reportError(response)
        if (response?._data?.code === ResponseCode.ERR_ACTION_UNAUTHORIZED) await forceLogout()
        throw response ?? error
      }

      // A refresh is already in flight - park this request until it settles
      if (isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          pendingRequests.push((token) => {
            if (!token) return reject(response ?? error)
            $fetch<T>(url, buildOptions(token)).then(resolve).catch(reject)
          })
        })
      }

      isRefreshing = true
      try {
        const token = await tryRefresh()

        if (!token) {
          flushPending(null)
          reportError(response)
          await forceLogout()
          throw response ?? error
        }

        flushPending(token)

        try {
          return await $fetch<T>(url, buildOptions(token))
        } catch (retryError: unknown) {
          // The freshly minted token still got rejected - surface it like any other failure
          const retryResponse = (retryError as { response?: FetchResponse<ResponseError> })?.response
          reportError(retryResponse)
          throw retryResponse ?? retryError
        }
      } finally {
        isRefreshing = false
      }
    }
  }

  return {
    provide: {
      api,
    },
  }
})