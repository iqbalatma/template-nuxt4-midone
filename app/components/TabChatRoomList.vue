<script setup lang="ts">
import fakers from '~/utils/faker'
import { Lucide } from '~/base/ui/lucide'
import { AvatarFallback, AvatarImage, AvatarRoot } from '~/base/ui/avatar'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { TabsContent } from '~/base/ui/tabs'
import { Input } from '~/base/ui/input'
</script>

<template>
  <!-- Tab: Chats -->
  <TabsContent value="chats" class="space-y-4">
    <Box>
      <div class="relative">
        <Input
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
            v-for="(faker, index) in fakers.slice(0, 10)"
            :key="'online-' + index"
            class="mr-4 w-11 cursor-pointer"
            href=""
          >
            <div class="relative">
              <AvatarRoot class="size-12 rounded-full">
                <AvatarFallback>{{ faker['users'][0]!['name'].substring(0, 2) }}</AvatarFallback>
                <AvatarImage :src="faker['photos'][0]" :alt="faker['users'][0]!['name']" />
              </AvatarRoot>
              <div
                class="bg-success/90 border-background absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
              ></div>
            </div>
            <div class="mt-1.5 truncate text-center text-xs opacity-70">
              {{ faker['users'][0]!['name'] }}
            </div>
          </a>
        </div>
      </div>
    </Box>
    <div class="scrollbar-hidden -mr-1 h-[29rem] space-y-4 overflow-y-auto pr-1 pt-1 snap-y">
      <Box
        v-for="(faker, fakerKey) in fakers.slice(0, 10)"
        :key="'chat-' + fakerKey"
        class="chat-item relative flex cursor-pointer items-center snap-start"
      >
        <div class="relative mr-1">
          <AvatarRoot class="rounded-full size-12">
            <AvatarFallback>{{ faker['users'][0]!['name'].substring(0, 2) }}</AvatarFallback>
            <AvatarImage :src="faker['photos'][0]" :alt="faker['users'][0]!['name']" />
          </AvatarRoot>
          <div
            class="bg-success/90 border-background absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
          ></div>
        </div>
        <div class="ml-2 overflow-hidden">
          <div class="flex items-center">
            <a class="font-medium" href="#">
              {{ faker['users'][0]!['name'] }}
            </a>
            <div class="ml-auto text-xs opacity-70">
              {{ faker['times'][0] }}
            </div>
          </div>
          <div class="mt-1 w-full truncate opacity-70">
            {{ faker['news'][0]!['shortContent'] }}
          </div>
        </div>
        <Badge
          v-if="faker['trueFalse'][0]"
          class="absolute right-0 top-0 -mr-1 -mt-1"
          variant="primary"
          look="outline"
        >
          {{ faker['notificationCount'] }}
        </Badge>
      </Box>
    </div>
  </TabsContent>
</template>

<style scoped></style>
