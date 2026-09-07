<script setup lang="ts">
import SectionNav from '~/components/SectionNav.vue'
import { accountMenus } from '~/main/section-menu'
</script>

<template>
  <SectionNav :menus="accountMenus" />
</template>
