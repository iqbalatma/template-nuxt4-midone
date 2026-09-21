/**
 * Turns an `?error=` reason from the OAuth callback into something a person can
 * act on. The reasons are keys under `auth.callback.errors.*`, so adding one on
 * the API side is a locale entry rather than a code change; anything unmapped
 * falls back to `unknown`.
 *
 * A composable rather than a plain util because it needs `useI18n`, and both
 * callers — `/auth` (popup result) and `/auth/callback` (full-page redirect) —
 * are setup contexts. One copy, so a reason handled in one flow is handled in
 * the other.
 */
export const useOAuthError = () => {
  const { t, te } = useI18n()

  const oauthErrorMessage = (reason: string) => {
    const key = `auth.callback.errors.${reason}`
    return te(key) ? t(key) : t('auth.callback.errors.unknown')
  }

  return { oauthErrorMessage }
}
