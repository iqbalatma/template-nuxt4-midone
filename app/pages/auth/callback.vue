<script lang="ts" setup>
import { useAuthService } from '~/services/AuthService'
import { useAuthStore } from '~/stores/auth'
import { useFlashStore } from '~/stores/flash'

/**
 * Landing point for the OAuth flow. The API redirects the browser here with
 * either `?access_token=...` or `?error=<reason>` - it never posts JSON, so
 * this page reads the query string rather than calling an endpoint.
 */
definePageMeta({
  layout: false,
  public: true,
})

const route = useRoute()
const { setAccessToken, setUnauthenticatedUser } = useAuthStore()
const { fetchMe } = useAuthService()
const flashStore = useFlashStore()

const { t, te } = useI18n()

/** Reasons the API can send back, mapped to something a person can act on. */
const errorMessage = (reason: string) => {
  const key = `auth.callback.errors.${reason}`
  return te(key) ? t(key) : t('auth.callback.errors.unknown')
}

const failed = (reason: string) => {
  flashStore.setFailed({
    code: 'ERR_AUTHENTICATION',
    message: errorMessage(reason),
    status_code: 401,
    timestamp: new Date().toISOString(),
  })
  return navigateTo('/auth')
}

onMounted(async () => {
  const error = route.query['error']
  if (typeof error === 'string' && error) {
    await setUnauthenticatedUser()
    await failed(error)
    return
  }

  const accessToken = route.query['access_token']
  if (typeof accessToken !== 'string' || !accessToken) {
    await failed('missing_code')
    return
  }

  setAccessToken(accessToken)

  // The redirect carries only a token, so the profile (and with it the
  // permission list the menu reads) has to be fetched before landing.
  const profile = await fetchMe().catch(() => null)
  if (!profile) {
    await setUnauthenticatedUser()
    await failed('issue_token_failed')
    return
  }

  await navigateTo('/')
})
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <div class="text-center">
      <div
        class="border-primary/20 border-t-primary mx-auto h-8 w-8 animate-spin rounded-full border-4"
      />
      <p class="mt-4 opacity-70">{{ $t('auth.callback.signingIn') }}</p>
    </div>
  </div>
</template>
