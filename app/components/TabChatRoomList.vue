<script setup lang="ts">
import { Lucide } from '~/base/ui/lucide'
import { AvatarFallback, AvatarImage, AvatarRoot } from '~/base/ui/avatar'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { TabsContent } from '~/base/ui/tabs'
import { Input } from '~/base/ui/input'
import type { ResponseDataCollectionWithoutPagination } from '~/types/response'
import { useChatStore, type ChatRoom } from '~/stores/chat'

const chatStore = useChatStore()
const { $api } = useNuxtApp()
const search = ref('')
const chatRooms = ref<ChatRoom[]>([])
const loading = ref(false)

const fetchChatRooms = async () => {
  loading.value = true
  try {
    const response = await $api<ResponseDataCollectionWithoutPagination<ChatRoom>>('api/chat-rooms', {
      method: 'GET',
    })
    chatRooms.value = response.payload.data
  } finally {
    loading.value = false
  }
}

const displayName = (room: ChatRoom) =>
  room.type === 'PERSONAL' && room.recipient ? room.recipient.name : room.name

const filteredRooms = computed(() =>
  search.value
    ? chatRooms.value.filter(r => displayName(r).toLowerCase().includes(search.value.toLowerCase()))
    : chatRooms.value
)

const onlineMembers = computed(() => {
  const seen = new Set<string>()
  const members: ChatMember[] = []
  for (const room of chatRooms.value) {
    const member = room.type === 'PERSONAL' ? room.recipient : null
    if (member && !seen.has(member.id)) {
      seen.add(member.id)
      members.push(member)
    }
  }
  return members
})

onMounted(fetchChatRooms)
</script>

<template>
  <!-- Tab: Chats -->
  <TabsContent value="chats" class="space-y-4">
    <Box>
      <div class="relative">
        <Input
          v-model="search"
          class="bg-foreground/[.03] px-4 py-3 pr-10"
          type="text"
          placeholder="Search for messages or users..."
        />
        <Lucide
          class="inset-y-0 right-0 my-auto mr-3 hidden size-4 opacity-70 sm:absolute"
          icon="Search"
        />
      </div>
      <div class="scrollbar-hidden overflow-x-auto">
        <div class="mt-5 flex">
          <a
            v-for="member in onlineMembers.slice(0, 10)"
            :key="'online-' + member.id"
            class="mr-4 w-11 cursor-pointer"
            href=""
          >
            <div class="relative">
              <AvatarRoot class="size-12 rounded-full">
                <AvatarFallback>{{ member.name.substring(0, 2) }}</AvatarFallback>
                <AvatarImage :alt="member.name" />
              </AvatarRoot>
              <div
                class="bg-success/90 border-background absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
              ></div>
            </div>
            <div class="mt-1.5 truncate text-center text-xs opacity-70">
              {{ member.name }}
            </div>
          </a>
        </div>
      </div>
    </Box>
    <div class="scrollbar-hidden -mr-1 h-[29rem] space-y-4 overflow-y-auto pr-1 pt-1 snap-y">
      <div v-if="loading" class="flex justify-center py-4 opacity-70">Loading...</div>
      <template v-else-if="filteredRooms.length">
        <Box
          v-for="room in filteredRooms"
          :key="'chat-' + room.id"
          class="chat-item relative flex cursor-pointer items-center snap-start"
          @click="chatStore.selectRoom(room)"
        >
          <div class="relative mr-1">
            <AvatarRoot class="rounded-full size-12">
              <AvatarFallback>{{ displayName(room).substring(0, 2) }}</AvatarFallback>
              <AvatarImage :alt="displayName(room)" />
            </AvatarRoot>
            <div
              class="bg-success/90 border-background absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
            ></div>
          </div>
          <div class="ml-2 overflow-hidden">
            <div class="flex items-center">
              <a class="font-medium" href="#">{{ displayName(room) }}</a>
            </div>
            <div class="mt-1 w-full truncate text-xs opacity-70">
              {{ room.type === 'PERSONAL' ? room.recipient?.username : room.name }}
            </div>
          </div>
        </Box>
      </template>
      <div v-else class="py-4 text-center opacity-70">No chats found.</div>
    </div>
  </TabsContent>
</template>

<style scoped></style>