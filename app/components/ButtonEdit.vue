<script setup lang="ts">
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'

const emit = defineEmits(['click-edit'])
</script>

<template>
  <Button size="sm" look="outline" @click="emit('click-edit')">
    <Lucide icon="CheckSquare" />
    {{ $t('common.edit') }}
  </Button>
</template>
