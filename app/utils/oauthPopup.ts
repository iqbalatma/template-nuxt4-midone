/**
 * Shared with `app/pages/auth/callback.vue`: when that page detects it was
 * opened by `openOAuthPopup` below (rather than by a top-level navigation), it
 * posts the OAuth result back as this message instead of finishing the login
 * itself — the store state that matters lives in the window that opened it.
 */
export const OAUTH_CALLBACK_MESSAGE_TYPE = 'oauth-callback'

export type OAuthPopupResult =
  | { status: 'blocked' }
  | { status: 'cancelled' }
  | { status: 'done'; access_token?: string; error?: string }

const POPUP_WIDTH = 480
const POPUP_HEIGHT = 640
const CLOSED_POLL_MS = 500

/**
 * Opens `url` in a centered popup and resolves once `/auth/callback`, loaded
 * inside it, posts the result back — or the popup is blocked or closed.
 *
 * `cancelled` is deliberately distinct from `blocked`: the caller should fall
 * back to a full-page redirect only when there was never a popup to begin with,
 * not when the person chose to close it. Falling back on a close would reopen
 * the flow they just dismissed, in the tab they were trying to keep.
 *
 * Messages from another origin are ignored — the popup navigates to the API and
 * back, so anything arriving mid-flow is not ours.
 */
export const openOAuthPopup = (url: string): Promise<OAuthPopupResult> => {
  const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2
  const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2
  const popup = window.open(
    url,
    'oauth-login',
    `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top}`,
  )

  if (!popup) return Promise.resolve({ status: 'blocked' })

  return new Promise((resolve) => {
    const cleanup = () => {
      window.removeEventListener('message', onMessage)
      window.clearInterval(closedCheck)
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== OAUTH_CALLBACK_MESSAGE_TYPE) return
      cleanup()
      resolve({ status: 'done', access_token: event.data.access_token, error: event.data.error })
    }

    // `close` does not fire cross-window, and a popup closed before it reaches
    // the callback posts nothing — without this poll the promise never settles
    // and the button stays spinning forever.
    const closedCheck = window.setInterval(() => {
      if (popup.closed) {
        cleanup()
        resolve({ status: 'cancelled' })
      }
    }, CLOSED_POLL_MS)

    window.addEventListener('message', onMessage)
  })
}
