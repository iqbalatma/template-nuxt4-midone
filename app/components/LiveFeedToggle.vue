<script setup lang="ts">
import { Lucide } from '~/base/ui/lucide'

// The status pill for a page backed by useLiveFeed: says whether the socket is
// up, and lets the reader freeze incoming rows without dropping it.
defineProps<{ connected: boolean }>()
const paused = defineModel<boolean>('paused', { required: true })
</script>

<template>
  <button
    type="button"
    class="border-foreground/10 hover:bg-foreground/5 flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
    :title="paused ? 'Resume live updates' : 'Pause live updates'"
    @click="paused = !paused"
  >
    <span
      class="h-2 w-2 rounded-full"
      :class="connected && !paused ? 'bg-success animate-pulse' : 'bg-foreground/30'"
    />
    <span class="opacity-70">
      {{ !connected ? 'Offline' : paused ? 'Paused' : 'Live' }}
    </span>
    <Lucide :icon="paused ? 'Play' : 'Pause'" class="h-3.5 w-3.5 opacity-70" />
  </button>
</template>
