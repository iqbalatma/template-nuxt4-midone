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

/** Reasons the API can send back, mapped to something a person can act on. */
const errorMessages: Record<string, string> = {
  invalid_state: 'The sign-in attempt expired or was tampered with. Please try again.',
  missing_code: 'Google did not return an authorization code. Please try again.',
  token_exchange_failed: 'Could not complete sign-in with Google. Please try again.',
  fetch_user_failed: 'Could not read your Google profile. Please try again.',
  no_account: 'No account is registered for that email address. Contact an administrator.',
  issue_token_failed: 'Sign-in succeeded but the session could not be created. Please try again.',
  access_denied: 'You cancelled the Google sign-in.',
}

const failed = (reason: string) => {
  flashStore.setFailed({
    code: 'ERR_AUTHENTICATION',
    message: errorMessages[reason] ?? 'Sign-in failed. Please try again.',
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
      <p class="mt-4 opacity-70">Signing you in&hellip;</p>
    </div>
  </div>
</template>
