<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { Lucide } from '~/base/ui/lucide'
import { useAuthorizedMenu } from '~/composables/useAuthorizedMenu'
import type { SectionMenu } from '~/main/section-menu'

// Left-hand nav for shell pages (/account). Entries are real routes, not local
// tabs: each list owns its own `?page=`/`?search=`, and switching entry must
// not carry the other one's query along.
const props = defineProps<{ menus: SectionMenu[] }>()

const menus = useAuthorizedMenu<SectionMenu>(() => props.menus)
const route = useRoute()
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 h-fit p-2 lg:col-span-3 xl:col-span-2">
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="menu in menus as SectionMenu[]"
          :key="menu.to"
          :to="menu.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
          :class="
            route.path === menu.to
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-foreground/70 hover:bg-foreground/5'
          "
        >
          <Lucide :icon="menu.icon" class="size-4 shrink-0" />
          <span class="min-w-0">
            <span class="block text-sm">{{ $t(menu.title) }}</span>
            <span class="text-foreground/40 block text-xs">
              {{ $t(menu.description) }}
            </span>
          </span>
        </NuxtLink>
      </nav>
    </Box>

    <div class="col-span-12 lg:col-span-9 xl:col-span-10">
      <NuxtPage />
    </div>
  </div>
</template>
