<script setup lang="ts">
import { Button } from '~/base/ui/button'
import { Lucide } from '~/base/ui/lucide'
import { ACTION_BUTTON_CLASS } from '~/utils/actionButton'

const emit = defineEmits(['click-delete'])
</script>

<template>
  <Button
    size="sm"
    look="text"
    variant="danger"
    :class="ACTION_BUTTON_CLASS"
    @click="emit('click-delete')"
  >
    <Lucide icon="Trash" />
    {{ $t('common.delete') }}
  </Button>
</template>
