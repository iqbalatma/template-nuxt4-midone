<script setup lang="ts">
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'

const emit = defineEmits(['click-view'])
</script>

<template>
  <Button size="sm" look="outline" variant="ghost" @click="emit('click-view')">
    <Lucide icon="Eye" />
    {{ $t('common.view') }}
  </Button>
</template>
