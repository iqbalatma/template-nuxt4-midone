import type BaseEntity from '~/types/entities/base_entity'

export interface ChatMember extends BaseEntity {
  name: string
  email: string
  username: string
}

export interface ChatRoom extends BaseEntity {
  type: 'PERSONAL' | 'GROUP'
  name: string
  members: ChatMember[]
  recipient: ChatMember | null
}

export interface GlobalOnlineUser {
  user_id: string
  username: string
}

export const useChatStore = defineStore('chatStore', () => {
  const selectedRoom = ref<ChatRoom | null>(null)
  const chatRooms = ref<ChatRoom[]>([])
  const globalOnlineUsers = ref<GlobalOnlineUser[]>([])

  const selectRoom = (room: ChatRoom) => {
    selectedRoom.value = room
  }

  const setChatRooms = (rooms: ChatRoom[]) => {
    chatRooms.value = rooms
  }

  const addOrUpdateRoom = (room: ChatRoom) => {
    const index = chatRooms.value.findIndex(r => r.id === room.id)
    if (index !== -1) {
      chatRooms.value[index] = room
    } else {
      chatRooms.value.unshift(room)
    }
  }

  const setGlobalOnlineUsers = (users: GlobalOnlineUser[]) => {
    globalOnlineUsers.value = users
  }

  const addGlobalOnlineUser = (user: GlobalOnlineUser) => {
    if (!globalOnlineUsers.value.some(u => u.user_id === user.user_id)) {
      globalOnlineUsers.value = [...globalOnlineUsers.value, user]
    }
  }

  const removeGlobalOnlineUser = (userId: string) => {
    globalOnlineUsers.value = globalOnlineUsers.value.filter(u => u.user_id !== userId)
  }

  const isGloballyOnline = (userId: string) =>
    globalOnlineUsers.value.some(u => u.user_id === userId)

  return {
    selectedRoom,
    chatRooms,
    globalOnlineUsers,
    selectRoom,
    setChatRooms,
    addOrUpdateRoom,
    setGlobalOnlineUsers,
    addGlobalOnlineUser,
    removeGlobalOnlineUser,
    isGloballyOnline,
  }
})
