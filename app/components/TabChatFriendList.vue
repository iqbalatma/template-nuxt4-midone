<script setup lang="ts">
import { MenuContent, MenuItem, MenuPositioner, MenuRoot, MenuTrigger } from '~/base/ui/menu'
import { Lucide } from '~/base/ui/lucide'
import { AvatarFallback, AvatarImage, AvatarRoot } from '~/base/ui/avatar'
import { Button } from '~/base/ui/button'
import { Box } from '~/base/ui/box'
import { TabsContent } from '~/base/ui/tabs'
import { Input } from '~/base/ui/input'
import fakers from '@/utils/faker'
</script>

<template>
  <!-- Tab: Friends -->
  <TabsContent value="friends" class="space-y-4">
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
      <Button class="mt-3 w-full" type="button" variant="primary" look="outline">
        Invite Friends
      </Button>
    </Box>
    <div class="scrollbar-hidden -mr-1 h-[29rem] space-y-4 overflow-y-auto pr-1 pt-1 snap-y">
      <div class="opacity-70 snap-start">A</div>
      <template v-for="i in [0, 1]" :key="'a-' + i">
        <Box class="relative flex cursor-pointer items-center">
          <div class="relative mr-1">
            <AvatarRoot class="rounded-full size-12">
              <AvatarFallback>{{ fakers[i]!['users'][0]!['name'].substring(0, 2) }}</AvatarFallback>
              <AvatarImage :src="fakers[i]!['photos'][0]" :alt="fakers[i]!['users'][0]!['name']" />
            </AvatarRoot>
            <div
              class="bg-success/90 border-background absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
            ></div>
          </div>
          <div class="ml-2 overflow-hidden">
            <div class="flex items-center">
              <a class="font-medium" href="">
                {{ fakers[i]!['users'][0]!['name'] }}
              </a>
            </div>
            <div class="mt-0.5 w-full truncate text-xs opacity-70">Last seen 2 hours ago</div>
          </div>
          <MenuRoot class="ml-auto w-auto">
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
      <div class="opacity-70 snap-start">B</div>
      <template v-for="i in [2, 3, 4]" :key="'b-' + i">
        <Box class="relative flex cursor-pointer items-center">
          <div class="relative mr-1">
            <AvatarRoot class="rounded-full size-12">
              <AvatarFallback>{{ fakers[i]!['users'][0]!['name'].substring(0, 2) }}</AvatarFallback>
              <AvatarImage :src="fakers[i]!['photos'][0]" :alt="fakers[i]!['users'][0]!['name']" />
            </AvatarRoot>
            <div
              class="bg-success/90 border-background absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
            ></div>
          </div>
          <div class="ml-2 overflow-hidden">
            <div class="flex items-center">
              <a class="font-medium" href="">
                {{ fakers[i]!['users'][0]!['name'] }}
              </a>
            </div>
            <div class="mt-0.5 w-full truncate text-xs opacity-70">Last seen 2 hours ago</div>
          </div>
          <MenuRoot class="ml-auto w-auto">
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
    </div>
  </TabsContent>
</template>

<style scoped></style>
