<script lang="ts" setup>
import { Box } from '@/base/ui/box'
import { TabsRoot, TabsList, TabsTrigger } from '@/base/ui/tabs'
import ChatRoom from '~/components/ChatRoom.vue'
import ChatTopBar from '~/components/ChatTopBar.vue'
import TabChatProfile from '~/components/TabChatProfile.vue'
import TabChatFriendList from '~/components/TabChatFriendList.vue'
import TabChatRoomList from '~/components/TabChatRoomList.vue'
</script>

<template>
  <div>
    <ChatTopBar />
    <div class="mt-5 grid grid-cols-12 gap-5">
      <!-- BEGIN: Chat Side Menu -->
      <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
        <TabsRoot defaultValue="chats" class="space-y-2">
          <Box class="p-2">
            <TabsList class="m-0 w-full">
              <TabsTrigger class="w-1/3" value="chats">Chats</TabsTrigger>
              <TabsTrigger class="w-1/3" value="friends">Friends</TabsTrigger>
              <TabsTrigger class="w-1/3" value="profile">Profile</TabsTrigger>
            </TabsList>
          </Box>

          <TabChatRoomList />
          <TabChatFriendList />
          <TabChatProfile />
        </TabsRoot>
      </div>
      <!-- END: Chat Side Menu -->

      <ChatRoom />
    </div>
  </div>
</template>
