import type { RuntimeConfig } from 'nuxt/schema'
import type { FetchOptions, FetchResponse } from 'ofetch'
import type {  ResponseError } from '~/types/response'
import { useFlashStore } from '~/stores/flash'
export default defineNuxtPlugin(() => {
  const config: RuntimeConfig = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }: { options: FetchOptions }) {
      // Add default headers here
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    },

    onResponseError({ response }: { response: FetchResponse<ResponseError> }) {
      const flashStore = useFlashStore()
      if (response._data) flashStore.setFailed(response._data)
      // throw response
    },
  })

  return {
    provide: {
      api,
    },
  }
})
