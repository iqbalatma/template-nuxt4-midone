<script setup lang="ts">
import { Lucide } from '~/base/ui/lucide'

const emit = defineEmits(['click-view'])
</script>

<template>
  <a class="mr-3 flex items-center" href="#" @click.prevent="emit('click-view')">
    <Lucide class="mr-1 h-4 w-4" icon="Eye" />
    View
  </a>
</template>
