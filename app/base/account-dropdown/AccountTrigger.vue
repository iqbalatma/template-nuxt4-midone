<script setup lang="ts">
import { Lucide } from '@/base/ui/lucide'
import { useAuthUser } from '@/composables/useAuthUser'

interface Props {
  class?: string
  innerClass?: any
  avatarClass?: string
  textClass?: string
}

const props = defineProps<Props>()
const { fullName, email, primaryRole } = useAuthUser()
</script>

<template>
  <div :class="['side-menu__account group/profile transition-[width]', props.class]">
    <div :class="['flex cursor-pointer items-center transition', props.innerClass]">
      <UserAvatar
        :class="[
          'relative flex flex-none items-center justify-center overflow-hidden rounded-full border-4 bg-background/20 text-xs font-medium uppercase dark:bg-foreground/20',
          props.avatarClass ?? 'h-10 w-10 border-background/20 dark:border-foreground/20',
        ]"
      />
      <div
        class="ms-3 flex w-full items-center overflow-hidden transition-opacity group-[.side-menu--collapsed.side-menu--on-hover]:ms-3 group-[.side-menu--collapsed.side-menu--on-hover]:w-full group-[.side-menu--collapsed.side-menu--on-hover]:opacity-100 xl:group-[.side-menu--collapsed]:ms-0 xl:group-[.side-menu--collapsed]:w-0 xl:group-[.side-menu--collapsed]:opacity-0"
      >
        <div :class="['w-28', props.textClass]">
          <div class="w-full truncate font-medium">{{ fullName || email }}</div>
          <div class="w-full truncate text-xs opacity-60">{{ primaryRole || '-' }}</div>
        </div>
        <Lucide class="me-4 ms-auto opacity-50 flex-none" icon="MoveRight" />
      </div>
    </div>
    <slot />
  </div>
</template>
