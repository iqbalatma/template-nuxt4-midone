<script setup lang="ts">
// Public for the same reason as the privacy policy: the login page links here
// and asks you to agree to it before you have an account.
definePageMeta({
  layout: false,
  public: true,
})

const SECTIONS = [
  'accounts',
  'access',
  'acceptableUse',
  'data',
  'availability',
  'suspension',
  'thirdParty',
  'disclaimer',
  'liability',
  'changes',
  'governingLaw',
  'contact',
] as const
</script>

<template>
  <LegalPage domain="terms" :sections="SECTIONS" last-updated="2026-09-08" />
</template>
