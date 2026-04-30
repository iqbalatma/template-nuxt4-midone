<script setup lang="ts">
import { MenuContent, MenuItem, MenuPositioner, MenuRoot, MenuTrigger } from '@/base/ui/menu'
import { AvatarFallback, AvatarImage, AvatarRoot } from '@/base/ui/avatar'
import { Textarea } from '@/base/ui/textarea'
import { Button } from '@/base/ui/button'
import { Box } from '@/base/ui/box'
import { Input } from '@/base/ui/input'
import fakers from '@/utils/faker'
import { Lucide } from '@/base/ui/lucide'
</script>

<template>
  <!-- BEGIN: Chat Content -->
  <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
    <Box class="p-0">
      <!-- BEGIN: Chat Active -->
      <div class="chat-content">
        <div class="flex h-full flex-col">
          <div class="flex flex-col border-b border-foreground/15 px-5 py-4 sm:flex-row">
            <div class="flex items-center">
              <AvatarRoot class="size-10 rounded-full sm:size-12">
                <AvatarFallback>{{
                  fakers[0]!['users'][0]!['name'].substring(0, 2)
                }}</AvatarFallback>
                <AvatarImage
                  :src="fakers[0]!['photos'][0]"
                  :alt="fakers[0]!['users'][0]!['name']"
                />
              </AvatarRoot>
              <div class="ml-3 mr-auto">
                <div class="text-base font-medium">
                  {{ fakers[0]!['users'][0]!['name'] }}
                </div>
                <div class="text-xs opacity-70 sm:text-sm">
                  Hey, I am using chat <span class="mx-1">&bull;</span>
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
          <div class="scrollbar-hidden flex-1 overflow-y-scroll px-5 pt-5">
            <div class="float-left mb-4 flex max-w-[90%] items-end sm:max-w-[49%]">
              <AvatarRoot class="mr-5 hidden size-10 rounded-full sm:block">
                <AvatarFallback>{{
                  fakers[0]!['users'][0]!['name'].substring(0, 2)
                }}</AvatarFallback>
                <AvatarImage
                  :src="fakers[0]!['photos'][0]"
                  :alt="fakers[0]!['users'][0]!['name']"
                />
              </AvatarRoot>
              <div
                class="bg-(--color)/10 border-(--color)/20 rounded-r-xl rounded-t-xl border px-4 py-3 [--color:var(--color-warning)]"
              >
                Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor
                <div class="mt-1 text-xs opacity-70">2 mins ago</div>
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
            <div class="clear-both"></div>
            <div class="float-right mb-4 flex max-w-[90%] items-end sm:max-w-[49%]">
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
                Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor
                <div class="mt-1 text-xs opacity-70">1 mins ago</div>
              </div>
              <AvatarRoot class="ml-5 hidden size-10 rounded-full sm:block">
                <AvatarFallback>{{
                  fakers[0]!['users'][0]!['name'].substring(0, 2)
                }}</AvatarFallback>
                <AvatarImage
                  :src="fakers[0]!['photos'][0]"
                  :alt="fakers[0]!['users'][0]!['name']"
                />
              </AvatarRoot>
            </div>
            <div class="clear-both"></div>
            <div class="float-right mb-4 flex max-w-[90%] items-end sm:max-w-[49%]">
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
                Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor
                <div class="mt-1 text-xs opacity-70">59 secs ago</div>
              </div>
              <AvatarRoot class="ml-5 hidden size-10 rounded-full sm:block">
                <AvatarFallback>{{
                  fakers[0]!['users'][0]!['name'].substring(0, 2)
                }}</AvatarFallback>
                <AvatarImage
                  :src="fakers[0]!['photos'][0]"
                  :alt="fakers[0]!['users'][0]!['name']"
                />
              </AvatarRoot>
            </div>
            <div class="clear-both"></div>
            <div class="mb-10 mt-5 text-center opacity-70">Today</div>
            <div class="float-left mb-4 flex max-w-[90%] items-end sm:max-w-[49%]">
              <AvatarRoot class="mr-5 hidden size-10 rounded-full sm:block">
                <AvatarFallback>{{
                  fakers[0]!['users'][0]!['name'].substring(0, 2)
                }}</AvatarFallback>
                <AvatarImage
                  :src="fakers[0]!['photos'][0]"
                  :alt="fakers[0]!['users'][0]!['name']"
                />
              </AvatarRoot>
              <div
                class="bg-(--color)/10 border-(--color)/20 rounded-r-xl rounded-t-xl border px-4 py-3 [--color:var(--color-warning)]"
              >
                Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor
                <div class="mt-1 text-xs opacity-70">10 secs ago</div>
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
            <div class="clear-both"></div>
            <div class="float-right mb-4 flex max-w-[90%] items-end sm:max-w-[49%]">
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
                Lorem ipsum
                <div class="mt-1 text-xs opacity-70">1 secs ago</div>
              </div>
              <AvatarRoot class="ml-5 hidden size-10 rounded-full sm:block">
                <AvatarFallback>{{
                  fakers[0]!['users'][0]!['name'].substring(0, 2)
                }}</AvatarFallback>
                <AvatarImage
                  :src="fakers[0]!['photos'][0]"
                  :alt="fakers[0]!['users'][0]!['name']"
                />
              </AvatarRoot>
            </div>
            <div class="clear-both"></div>
            <div class="float-left mb-4 flex max-w-[90%] items-end sm:max-w-[49%]">
              <AvatarRoot class="mr-5 hidden size-10 rounded-full sm:block">
                <AvatarFallback>{{
                  fakers[0]!['users'][0]!['name'].substring(0, 2)
                }}</AvatarFallback>
                <AvatarImage
                  :src="fakers[0]!['photos'][0]"
                  :alt="fakers[0]!['users'][0]!['name']"
                />
              </AvatarRoot>
              <div
                class="bg-(--color)/10 border-(--color)/20 rounded-r-xl rounded-t-xl border px-4 py-3 [--color:var(--color-warning)]"
              >
                {{ fakers[0]!['users'][0]!['name'] }} is typing
                <span class="typing-dots ml-1">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center border-t border-foreground/15 pb-10 pt-4 sm:py-4">
            <Textarea
              class="min-h-auto mx-5 h-16 resize-none border-transparent bg-transparent shadow-none px-5 py-3"
              rows="1"
              placeholder="Type your message..."
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
            >
              <Lucide class="size-4" icon="Send" />
            </Button>
          </div>
        </div>
      </div>
      <!-- END: Chat Active -->
      <!-- BEGIN: Chat Default -->
      <div class="chat-content hidden">
        <div class="flex h-full items-center">
          <div class="mx-auto text-center">
            <AvatarRoot class="mx-auto size-16 rounded-full">
              <AvatarFallback>{{ fakers[0]!['users'][0]!['name'].substring(0, 2) }}</AvatarFallback>
              <AvatarImage :src="fakers[0]!['photos'][0]" :alt="fakers[0]!['users'][0]!['name']" />
            </AvatarRoot>
            <div class="mt-3">
              <div class="text-base font-medium">Hey, {{ fakers[0]!['users'][0]!['name'] }}!</div>
              <div class="mt-1 opacity-70">Please select a chat to start messaging.</div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Chat Default -->
    </Box>
  </div>
  <!-- END: Chat Content -->
</template>

<style scoped></style>
