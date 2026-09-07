<script setup lang="ts">
// Readable without an account: someone deciding whether to sign up has to be
// able to read it, and the login page links here.
definePageMeta({
  layout: false,
  public: true,
})

const SECTIONS = [
  'collect',
  'use',
  'legalBasis',
  'cookies',
  'sharing',
  'retention',
  'security',
  'rights',
  'children',
  'changes',
  'contact',
] as const
</script>

<template>
  <LegalPage domain="privacyPolicy" :sections="SECTIONS" last-updated="2026-09-08" />
</template>
