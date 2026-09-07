import { onUnmounted, ref } from 'vue'
import { useAuthService } from '~/services/AuthService'

const RECONNECT_DELAY_MS = 3000

/**
 * Subscribes to one of the API's read-only WebSocket feeds (`/management/audits/ws`,
 * `/management/job-logs/ws`) and hands each frame to `onFrame`.
 *
 * Like useNotificationSocket, it mints a ws-token per connection rather than
 * reusing the access token: the web access token is bound to the httpOnly
 * verifier cookie, which the WS routes deliberately do not read.
 *
 * `paused` lets a page stop applying frames without dropping the socket — a
 * live feed that reorders rows under the cursor while someone is reading is
 * worse than no live feed.
 */
export const useLiveFeed = <T>(path: string, onFrame: (frame: T) => void) => {
  const connected = ref(false)
  const paused = ref(false)

  if (!import.meta.client) return { connected, paused, disconnect: () => {} }

  const config = useRuntimeConfig()
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
    socket = new WebSocket(`${wsBase}${path}?token=${encodeURIComponent(token)}`)

    socket.onopen = () => (connected.value = true)

    socket.onmessage = (event) => {
      if (paused.value) return
      try {
        onFrame(JSON.parse(event.data) as T)
      } catch {
        // ignore malformed frames
      }
    }

    // ponytail: fixed-delay reconnect, no exponential backoff or jitter —
    // upgrade if a server restart ever produces a reconnect storm.
    socket.onclose = () => {
      connected.value = false
      if (closedByUs) return
      retryTimer = setTimeout(connect, RECONNECT_DELAY_MS)
    }
  }

  const disconnect = () => {
    closedByUs = true
    if (retryTimer) clearTimeout(retryTimer)
    socket?.close()
  }

  connect()
  onUnmounted(disconnect)

  return { connected, paused, disconnect }
}
