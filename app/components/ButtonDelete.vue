<script setup lang="ts">
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'

const emit = defineEmits(['click-delete'])
</script>

<template>
  <Button size="sm" look="outline" variant="danger" @click="emit('click-delete')">
    <Lucide icon="Trash" />
    {{ $t('common.delete') }}
  </Button>
</template>
