<script setup lang="ts">
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { ACTION_BUTTON_CLASS } from '~/utils/actionButton'

const emit = defineEmits(['click-view'])
</script>

<template>
  <Button
    size="sm"
    look="text"
    variant="ghost"
    :class="ACTION_BUTTON_CLASS"
    @click="emit('click-view')"
  >
    <Lucide icon="Eye" />
    {{ $t('common.view') }}
  </Button>
</template>
