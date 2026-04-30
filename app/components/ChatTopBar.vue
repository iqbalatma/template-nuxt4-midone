<script setup lang="ts">
import { MenuContent, MenuItem, MenuPositioner, MenuRoot, MenuTrigger } from '~/base/ui/menu'
import { Lucide } from '~/base/ui/lucide'
import { Box } from '~/base/ui/box'
import { Button } from '~/base/ui/button'
</script>

<template>
  <div class="flex flex-col items-center sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Chat</h2>
    <div class="mt-4 flex w-full sm:mt-0 sm:w-auto">
      <Button class="mr-2" variant="primary" look="outline"> Start New Chat </Button>
      <MenuRoot class="ml-auto w-auto sm:ml-0">
        <MenuTrigger as-child>
          <Box class="px-2" as-child>
            <Button variant="ghost" class="box flex items-center">
              <span class="flex size-5 items-center justify-center">
                <Lucide class="size-4" icon="Plus" />
              </span>
            </Button>
          </Box>
        </MenuTrigger>
        <MenuPositioner>
          <MenuContent class="w-40">
            <MenuItem value="create-group">
              <Lucide class="mr-2 size-4" icon="User" /> Create Group
            </MenuItem>
            <MenuItem value="settings">
              <Lucide class="mr-2 size-4" icon="Settings" /> Settings
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>
    </div>
  </div>
</template>

<style scoped></style>
