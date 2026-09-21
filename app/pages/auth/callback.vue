<script lang="ts" setup>
import { useAuthService } from '~/services/AuthService'
import { useAuthStore } from '~/stores/auth'
import { useFlashStore } from '~/stores/flash'
import { useOAuthError } from '~/composables/useOAuthError'
import { OAUTH_CALLBACK_MESSAGE_TYPE } from '~/utils/oauthPopup'

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

const { oauthErrorMessage } = useOAuthError()

const failed = (reason: string) => {
  flashStore.setFailed({
    code: 'ERR_AUTHENTICATION',
    message: oauthErrorMessage(reason),
    status_code: 401,
    timestamp: new Date().toISOString(),
  })
  return navigateTo('/auth')
}

onMounted(async () => {
  const error = route.query['error']

  // Opened as a popup by /auth (see openOAuthPopup): hand the raw result to the
  // window that opened us and close, rather than finishing the login here — the
  // store this page would write to is not the one the app is using.
  if (window.opener && window.opener !== window) {
    window.opener.postMessage(
      {
        type: OAUTH_CALLBACK_MESSAGE_TYPE,
        access_token: route.query['access_token'],
        error,
      },
      window.location.origin,
    )
    window.close()
    return
  }

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
