import { useNotificationStore } from '~/stores/notification'
import { useAuthService } from '~/services/AuthService'
import type AppNotification from '~/types/entities/notification'

const RECONNECT_DELAY_MS = 3000

/**
 * Opens the live notification feed. Call once from a layout that only mounts
 * for authenticated pages; it returns a disposer.
 *
 * The regular access token is not usable here. A browser handshake cannot send
 * an Authorization header, so the token goes in the query string - and the web
 * access token is bound to the httpOnly `access_token_verifier` cookie, which
 * the WS route deliberately does not read. `POST /api/auth/ws-token` mints one
 * for exactly this purpose; the API refuses it everywhere else.
 */
export const useNotificationSocket = () => {
  if (!import.meta.client) return () => {}

  const config = useRuntimeConfig()
  const store = useNotificationStore()
  const { wsToken } = useAuthService()

  let socket: WebSocket | null = null
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let closedByUs = false

  const connect = async () => {
    if (closedByUs) return

    const token = await wsToken()
    // No token means the session is gone; the api plugin has already handled
    // that, so stop rather than reconnect into a loop.
    if (!token || closedByUs) return

    const wsBase = String(config.public.apiBase).replace(/^http/, 'ws')
    socket = new WebSocket(`${wsBase}/api/notifications/ws?token=${encodeURIComponent(token)}`)

    socket.onmessage = (event) => {
      try {
        const frame = JSON.parse(event.data)

        // Control frames carry an "event" key; a notification never does. The
        // permissions list lives in the auth store, so a role change has to be
        // re-read or the menu keeps drawing the old one until a full reload.
        if (frame?.event === 'permissions.changed') {
          useAuthService().fetchMe()
          return
        }

        store.receive(frame as AppNotification)
      } catch {
        // ignore malformed frames
      }
    }

    // ponytail: fixed-delay reconnect, no exponential backoff or jitter —
    // upgrade if a server restart ever produces a reconnect storm.
    socket.onclose = () => {
      if (closedByUs) return
      retryTimer = setTimeout(connect, RECONNECT_DELAY_MS)
    }
  }

  connect()

  return () => {
    closedByUs = true
    if (retryTimer) clearTimeout(retryTimer)
    socket?.close()
  }
}
