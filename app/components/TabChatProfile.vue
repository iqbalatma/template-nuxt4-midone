<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from '~/base/ui/avatar'
import { Lucide } from '~/base/ui/lucide'
import { Box } from '~/base/ui/box'
import { TabsContent } from '~/base/ui/tabs'
import type { ResponseSingleData } from '~/types/response'
import type BaseEntity from '~/types/entities/base_entity'

interface Me extends BaseEntity {
  name: string
  email: string
  username: string
}

const { $api } = useNuxtApp()
const me = ref<Me | null>(null)
const loading = ref(false)

const fetchMe = async () => {
  loading.value = true
  try {
    const response = await $api<ResponseSingleData<Me>>('api/users/me', {
      method: 'GET',
    })
    me.value = response.payload.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchMe)
</script>

<template>
  <!-- Tab: Profile -->
  <TabsContent value="profile" class="space-y-4">
    <div v-if="loading" class="flex justify-center py-10 opacity-70">Loading...</div>
    <template v-else-if="me">
      <Box class="py-10">
        <AvatarRoot class="mx-auto size-20 rounded-full">
          <AvatarFallback>{{ me.name.substring(0, 2) }}</AvatarFallback>
          <AvatarImage :alt="me.name" />
        </AvatarRoot>
        <div class="mt-3 text-center">
          <div class="text-lg font-medium">{{ me.name }}</div>
          <div class="mt-1 opacity-70">@{{ me.username }}</div>
        </div>
      </Box>
      <Box>
        <div class="flex items-center border-b border-foreground/15 pb-5">
          <div>
            <div class="opacity-70">Email</div>
            <div class="mt-1">{{ me.email }}</div>
          </div>
          <Lucide class="ml-auto size-4 opacity-70" icon="Mail" />
        </div>
        <div class="flex items-center pt-5">
          <div>
            <div class="opacity-70">Joined Date</div>
            <div class="mt-1">{{ new Date(me.created_at).toLocaleDateString() }}</div>
          </div>
          <Lucide class="ml-auto size-4 opacity-70" icon="Clock" />
        </div>
      </Box>
    </template>
  </TabsContent>
</template>

<style scoped></style>