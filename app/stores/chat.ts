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

export const useChatStore = defineStore('chatStore', () => {
  const selectedRoom = ref<ChatRoom | null>(null)

  const selectRoom = (room: ChatRoom) => {
    selectedRoom.value = room
  }

  return { selectedRoom, selectRoom }
})
