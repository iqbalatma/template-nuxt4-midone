import { useChatStore } from '~/stores/chat'

/**
 * Manages the single global presence WebSocket connection.
 *
 * Open once on app load → ws://host/api/ws/presence?token=<jwt>
 * Handles "connected" (seed online list) and "presence" (add/remove) events.
 * Reconnects with exponential backoff (1 s → 2 s → 4 s … capped at 30 s).
 */
export function usePresenceWebSocket() {
  const config = useRuntimeConfig()

  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let reconnectAttempt = 0
  let shouldReconnect = false

  const connected = ref(false)

  const resolveWsBase = (): string => {
    const wsBase = (config.public.wsBase as string) || ''
    if (wsBase) return wsBase
    const apiBase = (config.public.apiBase as string) || ''
    return apiBase.replace(/^http/, 'ws')
  }

  const doConnect = () => {
    const chatStore = useChatStore()

    if (ws) {
      ws.onclose = null
      ws.onerror = null
      ws.close()
      ws = null
    }

    const token = useCookie('access_token').value
    if (!token) return

    const url = `${resolveWsBase()}/api/ws/presence?token=${token}`
    ws = new WebSocket(url)

    ws.onopen = () => {
      connected.value = true
      reconnectAttempt = 0
    }

    ws.onmessage = (rawEvent: MessageEvent) => {
      try {
        const data = JSON.parse(rawEvent.data as string)

        if (data.type === 'connected') {
          chatStore.setGlobalOnlineUsers(data.online_users ?? [])
        } else if (data.type === 'presence') {
          if (data.status === 'online') {
            chatStore.addGlobalOnlineUser({ user_id: data.user_id, username: data.username })
          } else {
            chatStore.removeGlobalOnlineUser(data.user_id)
          }
        }
      } catch {
        // ignore malformed frames
      }
    }

    ws.onerror = () => {
      ws?.close()
    }

    ws.onclose = () => {
      connected.value = false
      if (shouldReconnect) {
        const delay = Math.min(1000 * 2 ** reconnectAttempt, 30_000)
        reconnectAttempt++
        reconnectTimer = setTimeout(doConnect, delay)
      }
    }
  }

  /** Start the global presence connection. Call once on app load. */
  const connect = () => {
    disconnect()
    shouldReconnect = true
    reconnectAttempt = 0
    doConnect()
  }

  /** Close the connection and stop all reconnect attempts. */
  const disconnect = () => {
    shouldReconnect = false
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (ws) {
      ws.onclose = null
      ws.onerror = null
      ws.close()
      ws = null
    }
    connected.value = false
  }

  return { connect, disconnect, connected }
}

