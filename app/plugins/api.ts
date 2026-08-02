import type { RuntimeConfig } from 'nuxt/schema'
import type { FetchOptions, FetchResponse } from 'ofetch'
import type { ResponseError } from '~/types/response'
import { useFlashStore } from '~/stores/flash'
export default defineNuxtPlugin(() => {
  const config: RuntimeConfig = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',

    onRequest({ options }: { options: FetchOptions }) {
      // Add default headers here
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${useCookie('access_token').value ?? ''}`,
      }
    },

    onResponseError({ response }: { response: FetchResponse<ResponseError> }) {
      const flashStore = useFlashStore()
      flashStore.clearMessages()

      if (response._data) flashStore.setFailed(response._data)

      if (response._data?.code === 'ERR_ACTION_UNAUTHORIZED') {
        useAuthStore().setUnauthenticatedUser()
        navigateTo('/auth')
      }
      throw response
    },
  })

  return {
    provide: {
      api,
    },
  }
})
