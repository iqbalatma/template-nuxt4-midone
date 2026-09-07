<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { Badge } from '@/base/ui/badge'
import { Lucide } from '@/base/ui/lucide'
import { useAuthUser } from '@/composables/useAuthUser'
import { useAuthService } from '~/services/AuthService'

interface Props {
  class?: string
  boxClass?: string
}

const props = defineProps<Props>()
const { logout } = useAuthService()
const { fullName, email, roleNames } = useAuthUser()
</script>

<template>
  <div
    v-bind="$attrs"
    :class="[
      'invisible opacity-0 scale-95 transition-all duration-200 delay-0 group-hover/profile:visible group-hover/profile:opacity-100 group-hover/profile:scale-100 group-hover/profile:delay-200',
      props.class,
    ]"
  >
    <Box
      :class="`text-foreground before:shadow-foreground/5 flex w-64 flex-col gap-2.5 px-6 py-5 before:rounded-2xl before:shadow-xl before:backdrop-blur after:rounded-2xl ${props.boxClass ?? ''}`"
    >
      <div class="flex flex-col gap-0.5">
        <div class="truncate font-medium">{{ fullName || '-' }}</div>
        <div class="mt-0.5 truncate text-xs opacity-70">{{ email }}</div>
        <div v-if="roleNames.length" class="mt-1.5 flex flex-wrap gap-1">
          <Badge
            v-for="role in roleNames"
            :key="role"
            look="outline"
            variant="primary"
            class="text-[10px]"
          >
            {{ role }}
          </Badge>
        </div>
      </div>
      <div class="bg-foreground/5 h-px"></div>
      <div class="flex flex-col gap-0.5">
        <NuxtLink
          class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5"
          to="/profile/detail"
        >
          <Lucide icon="UserRound" /> Profile
        </NuxtLink>
        <NuxtLink
          class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5"
          to="/profile/password"
        >
          <Lucide icon="KeyRound" /> Update Password
        </NuxtLink>
      </div>
      <div class="bg-foreground/5 h-px"></div>
      <div class="flex flex-col gap-0.5">
        <a
          class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5"
          href="#"
          @click.prevent="logout()"
        >
          <Lucide icon="Power" /> Logout
        </a>
      </div>
    </Box>
  </div>
</template>
