<script setup lang="ts">
import SectionNav from '~/components/SectionNav.vue'
import { profileMenus } from '~/main/section-menu'
</script>

<template>
  <SectionNav :menus="profileMenus" />
</template>
