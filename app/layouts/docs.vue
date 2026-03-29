<template>
  <div class="flex items-center justify-center min-h-screen py-10">
    <Box class="w-full xl:w-2/3">
        <div class="text-xl font-medium capitalize border-b border-foreground/15 pb-5">{{ $route.name }}</div>
        <div class="mt-16 flex flex-col gap-10">
            <slot />
        </div>
    </Box>
  </div>
</template>

<script setup lang="ts">
import { Box } from "@/components/ui/box";
</script>
