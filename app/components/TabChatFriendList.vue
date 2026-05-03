<script setup lang="ts">
import { MenuContent, MenuItem, MenuPositioner, MenuRoot, MenuTrigger } from '~/base/ui/menu'
import { Lucide } from '~/base/ui/lucide'
import { AvatarFallback, AvatarImage, AvatarRoot } from '~/base/ui/avatar'
import { Button } from '~/base/ui/button'
import { Box } from '~/base/ui/box'
import { TabsContent } from '~/base/ui/tabs'
import { Input } from '~/base/ui/input'
import type { ResponseDataCollectionWithoutPagination, ResponseSingleData } from '~/types/response'
import type BaseEntity from '~/types/entities/base_entity'
import { useChatStore, type ChatRoom } from '~/stores/chat'

interface ChatUser extends BaseEntity {
  name: string
  email: string
  username: string
}

const chatStore = useChatStore()
const { $api } = useNuxtApp()
const search = ref('')
const users = ref<ChatUser[]>([])
const loading = ref(false)
const creating = ref(false)

const openChat = async (user: ChatUser) => {
  if (creating.value) return
  creating.value = true
  try {
    const response = await $api<ResponseSingleData<ChatRoom>>('api/chat-rooms', {
      method: 'POST',
      body: { type: 'PERSONAL', name: '-', target_user_id: user.id },
    })
    const room = response.payload.data
    // If the API returns no recipient, build a temporary one from the selected user
    if (!room.recipient) {
      room.recipient = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }
    }
    chatStore.addOrUpdateRoom(room)
    chatStore.selectRoom(room)
  } finally {
    creating.value = false
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await $api<ResponseDataCollectionWithoutPagination<ChatUser>>('api/users', {
      method: 'GET',
    })
    users.value = response.payload.data
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() =>
  search.value
    ? users.value.filter(u => u.name.toLowerCase().includes(search.value.toLowerCase()))
    : users.value
)

const groupedUsers = computed(() => {
  const groups: Record<string, ChatUser[]> = {}
  for (const user of filteredUsers.value) {
    const letter = user.name.charAt(0).toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter]!.push(user)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

onMounted(fetchUsers)
</script>

<template>
  <!-- Tab: Friends -->
  <TabsContent value="friends" class="space-y-4">
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
    </Box>
    <div class="scrollbar-hidden -mr-1 h-[29rem] space-y-4 overflow-y-auto pr-1 pt-1 snap-y">
      <div v-if="loading" class="flex justify-center py-4 opacity-70">Loading...</div>
      <template v-else-if="groupedUsers.length">
        <template v-for="[letter, group] in groupedUsers" :key="letter">
          <div class="opacity-70 snap-start">{{ letter }}</div>
          <Box
            v-for="user in group"
            :key="user.id"
            class="relative flex cursor-pointer items-center"
            @click="openChat(user)"
          >
            <div class="relative mr-1">
              <AvatarRoot class="rounded-full size-12">
                <AvatarFallback>{{ user.name.substring(0, 2) }}</AvatarFallback>
                <AvatarImage :alt="user.name" />
              </AvatarRoot>
              <div
                class="bg-success/90 border-background absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
              ></div>
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a class="font-medium" href="">{{ user.name }}</a>
              </div>
              <div class="mt-0.5 w-full truncate text-xs opacity-70">{{ user.username }}</div>
            </div>
            <MenuRoot class="ml-auto w-auto" @click.stop>
              <MenuTrigger as-child>
                <a class="block size-5" href="#">
                  <Lucide class="size-5 opacity-70" icon="MoreHorizontal" />
                </a>
              </MenuTrigger>
              <MenuPositioner>
                <MenuContent class="w-40">
                  <MenuItem value="share">
                    <Lucide class="mr-2 size-4" icon="Share" /> Share Contact
                  </MenuItem>
                  <MenuItem value="copy">
                    <Lucide class="mr-2 size-4" icon="Copy" /> Copy Contact
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </Box>
        </template>
      </template>
      <div v-else class="py-4 text-center opacity-70">No friends found.</div>
    </div>
  </TabsContent>
</template>

<style scoped></style>
