<script setup lang="ts">
import { MenuContent, MenuItem, MenuPositioner, MenuRoot, MenuTrigger } from '@/base/ui/menu'
import { AvatarFallback, AvatarImage, AvatarRoot } from '@/base/ui/avatar'
import { Textarea } from '@/base/ui/textarea'
import { Button } from '@/base/ui/button'
import { Box } from '@/base/ui/box'
import { Input } from '@/base/ui/input'
import { Lucide } from '@/base/ui/lucide'
import type { ResponseDataCollectionWithoutPagination, ResponseSingleData } from '~/types/response'
import type BaseEntity from '~/types/entities/base_entity'
import { useChatStore } from '~/stores/chat'

interface Me extends BaseEntity {
  name: string
  email: string
  username: string
}

interface ChatSender extends BaseEntity {
  name: string
  email: string
  username: string
}

interface Chat extends BaseEntity {
  content: string
  recipient_user_id: string
  sender_user_id: string
  chat_room_id: string
  sender: ChatSender
}

const chatStore = useChatStore()
const { $api } = useNuxtApp()

const me = ref<Me | null>(null)
const chats = ref<Chat[]>([])
const loading = ref(false)
const sending = ref(false)
const newMessage = ref('')
const messageBox = ref<HTMLElement | null>(null)

const selectedRoom = computed(() => chatStore.selectedRoom)
const roomDisplayName = computed(() => {
  const room = selectedRoom.value
  if (!room) return ''
  return room.type === 'PERSONAL' && room.recipient ? room.recipient.name : room.name
})

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const isMine = (chat: Chat) => me.value !== null && chat.sender_user_id === me.value.id

const fetchMe = async () => {
  const response = await $api<ResponseSingleData<Me>>('api/users/me', { method: 'GET' })
  me.value = response.payload.data
}

const fetchChats = async () => {
  if (!selectedRoom.value) return
  loading.value = true
  try {
    const response = await $api<ResponseDataCollectionWithoutPagination<Chat>>(
      `api/chat-rooms/${selectedRoom.value.id}/chats`,
      { method: 'GET' },
    )
    chats.value = response.payload.data
  } finally {
    loading.value = false
  }
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageBox.value) {
    messageBox.value.scrollTop = messageBox.value.scrollHeight
  }
}

const sendMessage = async () => {
  const content = newMessage.value.trim()
  if (!content || !selectedRoom.value || sending.value) return
  sending.value = true
  try {
    const response = await $api<ResponseSingleData<Chat>>(
      `api/chat-rooms/${selectedRoom.value.id}/chats`,
      { method: 'POST', body: { content } },
    )
    chats.value.push(response.payload.data)
    newMessage.value = ''
    scrollToBottom()
  } finally {
    sending.value = false
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

watch(selectedRoom, () => {
  chats.value = []
  newMessage.value = ''
  fetchChats()
})

onMounted(fetchMe)
</script>

<template>
  <!-- BEGIN: Chat Content -->
  <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
    <Box class="p-0">

      <!-- BEGIN: Chat Active -->
      <div v-if="selectedRoom" class="flex h-[600px] flex-col">
          <!-- Header -->
          <div class="flex flex-col border-b border-foreground/15 px-5 py-4 sm:flex-row">
            <div class="flex items-center">
              <AvatarRoot class="size-10 rounded-full sm:size-12">
                <AvatarFallback>{{ roomDisplayName.substring(0, 2) }}</AvatarFallback>
                <AvatarImage :alt="roomDisplayName" />
              </AvatarRoot>
              <div class="ml-3 mr-auto">
                <div class="text-base font-medium">{{ roomDisplayName }}</div>
                <div class="text-xs opacity-70 sm:text-sm">
                  Online
                </div>
              </div>
            </div>
            <div
              class="-mx-5 mt-5 flex items-center border-t border-foreground/15 px-5 pt-3 sm:mx-0 sm:ml-auto sm:mt-0 sm:border-0 sm:px-0 sm:pt-0"
            >
              <a class="size-5 opacity-70" href="#">
                <Lucide class="size-5" icon="Search" />
              </a>
              <a class="ml-5 size-5 opacity-70" href="#">
                <Lucide class="size-5" icon="UserPlus" />
              </a>
              <MenuRoot class="ml-auto sm:ml-3">
                <MenuTrigger as-child>
                  <a class="size-5 opacity-70" href="#">
                    <Lucide class="size-5" icon="MoreVertical" />
                  </a>
                </MenuTrigger>
                <MenuPositioner>
                  <MenuContent class="w-40">
                    <MenuItem value="share">
                      <Lucide class="mr-2 size-4" icon="Share" /> Share Contact
                    </MenuItem>
                    <MenuItem value="settings">
                      <Lucide class="mr-2 size-4" icon="Settings" /> Settings
                    </MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messageBox" class="scrollbar-hidden flex-1 overflow-y-scroll px-5 pt-5">
            <div v-if="loading" class="flex justify-center py-4 opacity-70">Loading...</div>
            <template v-else-if="chats.length">
              <template v-for="chat in chats" :key="chat.id">
                <!-- Received message -->
                <div v-if="!isMine(chat)" class="float-left mb-4 flex max-w-[90%] items-end sm:max-w-[49%]">
                  <AvatarRoot class="mr-5 hidden size-10 rounded-full sm:block">
                    <AvatarFallback>{{ chat.sender.name.substring(0, 2) }}</AvatarFallback>
                    <AvatarImage :alt="chat.sender.name" />
                  </AvatarRoot>
                  <div
                    class="bg-(--color)/10 border-(--color)/20 rounded-r-xl rounded-t-xl border px-4 py-3 [--color:var(--color-warning)]"
                  >
                    {{ chat.content }}
                    <div class="mt-1 text-xs opacity-70">{{ formatTime(chat.created_at) }}</div>
                  </div>
                  <MenuRoot class="my-auto w-auto ml-3 hidden sm:block">
                    <MenuTrigger as-child>
                      <a class="size-4 opacity-70" href="#">
                        <Lucide class="size-4" icon="MoreVertical" />
                      </a>
                    </MenuTrigger>
                    <MenuPositioner>
                      <MenuContent class="w-40">
                        <MenuItem value="reply">
                          <Lucide class="mr-2 size-4" icon="CornerUpLeft" /> Reply
                        </MenuItem>
                        <MenuItem value="delete">
                          <Lucide class="mr-2 size-4" icon="Trash" /> Delete
                        </MenuItem>
                      </MenuContent>
                    </MenuPositioner>
                  </MenuRoot>
                </div>

                <!-- Sent message -->
                <div v-else class="float-right mb-4 flex max-w-[90%] items-end sm:max-w-[49%]">
                  <MenuRoot class="my-auto w-auto mr-3 hidden sm:block">
                    <MenuTrigger as-child>
                      <a class="size-4 opacity-70" href="#">
                        <Lucide class="size-4" icon="MoreVertical" />
                      </a>
                    </MenuTrigger>
                    <MenuPositioner>
                      <MenuContent class="w-40">
                        <MenuItem value="reply">
                          <Lucide class="mr-2 size-4" icon="CornerUpLeft" /> Reply
                        </MenuItem>
                        <MenuItem value="delete">
                          <Lucide class="mr-2 size-4" icon="Trash" /> Delete
                        </MenuItem>
                      </MenuContent>
                    </MenuPositioner>
                  </MenuRoot>
                  <div
                    class="bg-(--color)/10 border-(--color)/20 rounded-l-xl rounded-t-xl border px-4 py-3 [--color:var(--color-primary)]"
                  >
                    {{ chat.content }}
                    <div class="mt-1 text-xs opacity-70">{{ formatTime(chat.created_at) }}</div>
                  </div>
                  <AvatarRoot class="ml-5 hidden size-10 rounded-full sm:block">
                    <AvatarFallback>{{ me?.name?.substring(0, 2) }}</AvatarFallback>
                    <AvatarImage :alt="me?.name" />
                  </AvatarRoot>
                </div>

                <div class="clear-both"></div>
              </template>
            </template>
            <div v-else class="py-4 text-center opacity-70">No messages yet.</div>
          </div>

          <!-- Input -->
          <div class="flex items-center border-t border-foreground/15 pb-10 pt-4 sm:py-4">
            <Textarea
              :value="newMessage"
              class="min-h-auto mx-5 h-16 resize-none border-transparent bg-transparent shadow-none px-5 py-3"
              rows="1"
              placeholder="Type your message..."
              @input="newMessage = ($event.target as HTMLTextAreaElement).value"
              @keydown="onKeydown"
            />
            <div class="absolute bottom-0 left-0 mb-5 ml-5 flex sm:static sm:mb-0 sm:ml-0">
              <div class="relative mr-3 size-4 opacity-70 sm:mr-5 sm:size-5">
                <Lucide class="size-full" icon="Paperclip" />
                <Input class="absolute left-0 top-0 size-full opacity-0" type="file" />
              </div>
            </div>
            <Button
              class="mr-5 flex size-8 flex-none items-center justify-center rounded-full sm:size-10"
              variant="primary"
              :disabled="sending || !newMessage.trim()"
              @click="sendMessage"
            >
              <Lucide class="size-4" icon="Send" />
            </Button>
          </div>
      </div>
      <!-- END: Chat Active -->

      <!-- BEGIN: Chat Default -->
      <div v-else class="flex h-[600px] items-center justify-center">
        <div class="text-center">
          <AvatarRoot class="mx-auto size-16 rounded-full">
            <AvatarFallback>{{ me?.name?.substring(0, 2) }}</AvatarFallback>
            <AvatarImage :alt="me?.name" />
          </AvatarRoot>
          <div class="mt-3">
            <div class="text-base font-medium">Hey, {{ me?.name }}!</div>
            <div class="mt-1 opacity-70">Please select a chat to start messaging.</div>
          </div>
        </div>
      </div>
      <!-- END: Chat Default -->

    </Box>
  </div>
  <!-- END: Chat Content -->
</template>

<style scoped></style>