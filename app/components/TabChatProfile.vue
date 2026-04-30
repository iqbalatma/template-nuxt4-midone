<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from '~/base/ui/avatar'
import { Lucide } from '~/base/ui/lucide'
import { Box } from '~/base/ui/box'
import { TabsContent } from '~/base/ui/tabs'
import fakers from '@/utils/faker'
</script>

<template>
  <!-- Tab: Profile -->
  <TabsContent value="profile" class="space-y-4">
    <Box class="py-10">
      <AvatarRoot class="mx-auto size-20 rounded-full">
        <AvatarFallback>{{ fakers[0]!['users'][0]!['name'].substring(0, 2) }}</AvatarFallback>
        <AvatarImage :src="fakers[0]!['photos'][0]" :alt="fakers[0]!['users'][0]!['name']" />
      </AvatarRoot>
      <div class="mt-3 text-center">
        <div class="text-lg font-medium">
          {{ fakers[0]!['users'][0]!['name'] }}
        </div>
        <div class="mt-1 opacity-70">Tailwind Admin Dashboard Template</div>
      </div>
    </Box>
    <Box>
      <div class="flex items-center border-b border-foreground/15 pb-5">
        <div>
          <div class="opacity-70">Country</div>
          <div class="mt-1">New York City, USA</div>
        </div>
        <Lucide class="ml-auto size-4 opacity-70" icon="Globe" />
      </div>
      <div class="flex items-center border-b border-foreground/15 py-5">
        <div>
          <div class="opacity-70">Phone</div>
          <div class="mt-1">+32 19 23 62 24 34</div>
        </div>
        <Lucide class="ml-auto size-4 opacity-70" icon="Mic" />
      </div>
      <div class="flex items-center border-b border-foreground/15 py-5">
        <div>
          <div class="opacity-70">Email</div>
          <div class="mt-1">
            {{ fakers[0]!['users'][0]!['email'] }}
          </div>
        </div>
        <Lucide class="ml-auto size-4 opacity-70" icon="Mail" />
      </div>
      <div class="flex items-center pt-5">
        <div>
          <div class="opacity-70">Joined Date</div>
          <div class="mt-1">{{ fakers[0]!['dates'][0] }}</div>
        </div>
        <Lucide class="ml-auto size-4 opacity-70" icon="Clock" />
      </div>
    </Box>
  </TabsContent>
</template>

<style scoped></style>
