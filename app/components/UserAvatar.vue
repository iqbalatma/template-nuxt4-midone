<script setup lang="ts">
import { AvatarRoot, AvatarFallback, AvatarImage } from '@/base/ui/avatar'
import { useAuthUser } from '~/composables/useAuthUser'

// The signed-in user's own avatar, falling back to initials until there is a
// picture. One component rather than the same three lines in eight theme
// headers, which is how the picture stayed missing from half of them before.
// Classes fall through to AvatarRoot, so each theme keeps its own sizing.
const { initials, avatarUrl } = useAuthUser()
</script>

<template>
  <AvatarRoot>
    <AvatarFallback>{{ initials }}</AvatarFallback>
    <AvatarImage v-if="avatarUrl" :src="avatarUrl" alt="" />
  </AvatarRoot>
</template>
