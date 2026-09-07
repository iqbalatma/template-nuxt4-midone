<script setup lang="ts">
import SectionNav from '~/components/SectionNav.vue'
import { systemMenus } from '~/main/section-menu'
</script>

<template>
  <SectionNav :menus="systemMenus" />
</template>
