// ── Event types ────────────────────────────────────────────────────────────────

export interface WsOnlineUser {
  user_id: string
  username: string
}

export interface WsConnectedEvent {
  type: 'connected'
  online_users: WsOnlineUser[]
}

export interface WsPresenceEvent {
  type: 'presence'
  user_id: string
  username: string
  status: 'online' | 'offline'
}

export interface WsMessageEvent {
  type: 'message'
  id: string
  room_id: string
  sender_id: string
  username: string
  content: string
  created_at: string
}

/** Union of all server-sent frames */
export type WsEvent = WsConnectedEvent | WsPresenceEvent | WsMessageEvent

/** Convenience alias — the shape of an incoming chat message */
export type WsMessage = WsMessageEvent

// ── Composable ─────────────────────────────────────────────────────────────────

type MessageHandler = (msg: WsMessage) => void

export function useChatWebSocket() {
  const config = useRuntimeConfig()

  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let reconnectAttempt = 0
  let currentRoomId: string | null = null
  let shouldReconnect = false
  let messageHandler: MessageHandler | null = null

  const connected = ref(false)
  const onlineUsers = ref<WsOnlineUser[]>([])

  /** Derive ws base from apiBase when wsBase is not explicitly set */
  const resolveWsBase = (): string => {
    const wsBase = (config.public.wsBase as string) || ''
    if (wsBase) return wsBase
    const apiBase = (config.public.apiBase as string) || ''
    return apiBase.replace(/^http/, 'ws')
  }

  const handleEvent = (event: WsEvent) => {
    if (event.type === 'connected') {
      onlineUsers.value = event.online_users
    } else if (event.type === 'presence') {
      if (event.status === 'online') {
        // Add if not already present
        if (!onlineUsers.value.some(u => u.user_id === event.user_id)) {
          onlineUsers.value = [...onlineUsers.value, { user_id: event.user_id, username: event.username }]
        }
      } else {
        onlineUsers.value = onlineUsers.value.filter(u => u.user_id !== event.user_id)
      }
    } else if (event.type === 'message') {
      messageHandler?.(event)
    }
  }

  const doConnect = (roomId: string) => {
    if (ws) {
      ws.onclose = null
      ws.onerror = null
      ws.close()
      ws = null
    }

    const token = useCookie('access_token').value
    if (!token) return

    const url = `${resolveWsBase()}/api/ws/${roomId}?token=${token}`
    ws = new WebSocket(url)

    ws.onopen = () => {
      connected.value = true
      reconnectAttempt = 0
    }

    ws.onmessage = (rawEvent: MessageEvent) => {
      try {
        const event: WsEvent = JSON.parse(rawEvent.data as string)
        handleEvent(event)
      } catch {
        // ignore malformed frames
      }
    }

    ws.onerror = () => {
      ws?.close()
    }

    ws.onclose = () => {
      connected.value = false
      if (shouldReconnect && currentRoomId) {
        const delay = Math.min(1000 * 2 ** reconnectAttempt, 30_000)
        reconnectAttempt++
        reconnectTimer = setTimeout(() => doConnect(currentRoomId!), delay)
      }
    }
  }

  /**
   * Open a WebSocket connection for the given room.
   * Any existing connection is closed first.
   */
  const connect = (roomId: string, onMessage: MessageHandler) => {
    disconnect()
    shouldReconnect = true
    currentRoomId = roomId
    messageHandler = onMessage
    reconnectAttempt = 0
    doConnect(roomId)
  }

  /** Close the connection and stop reconnect attempts. */
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
    onlineUsers.value = []
    currentRoomId = null
    messageHandler = null
  }

  /** Send a chat message via the open WebSocket. */
  const send = (content: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ content }))
    }
  }

  return { connect, disconnect, send, connected, onlineUsers }
}
