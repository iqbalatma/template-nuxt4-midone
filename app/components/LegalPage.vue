<script setup lang="ts">
import { Box } from '~/base/ui/box'
import { Lucide } from '~/base/ui/lucide'
import logoUrl from '~/assets/images/logo.svg'

// The frame shared by the privacy policy and the terms: same shape, different
// domain of keys. `sections` lives on the page rather than in the JSON so a
// translation file can never reorder or drop one.
const props = defineProps<{
  /** i18n domain holding title/intro/back/lastUpdated and a `sections` map */
  domain: string
  sections: readonly string[]
  /** Bumped by hand when the text changes — the file's mtime is not it. */
  lastUpdated: string
}>()

const { t } = useI18n()
useHead({ title: computed(() => t(`${props.domain}.title`)) })
</script>

<template>
  <div class="min-h-screen py-10">
    <div class="mx-auto w-full px-5 sm:w-4/5 lg:w-3/5">
      <div class="mb-6 flex items-center justify-between gap-3">
        <img :src="logoUrl" alt="" class="h-8 w-auto" />
        <NuxtLink to="/" class="text-primary flex items-center gap-1.5 text-sm">
          <Lucide icon="ArrowLeft" class="size-4" />
          {{ $t(`${domain}.back`) }}
        </NuxtLink>
      </div>

      <Box class="p-6 sm:p-8">
        <h1 class="text-2xl font-medium">{{ $t(`${domain}.title`) }}</h1>
        <SmallInfo>{{ $t(`${domain}.lastUpdated`, { date: lastUpdated }) }}</SmallInfo>

        <p class="mt-5 text-sm leading-relaxed opacity-80">{{ $t(`${domain}.intro`) }}</p>

        <section v-for="section in sections" :key="section" class="mt-6">
          <h2 class="font-medium">{{ $t(`${domain}.sections.${section}.title`) }}</h2>
          <p class="mt-1.5 text-sm leading-relaxed opacity-80">
            {{ $t(`${domain}.sections.${section}.body`) }}
          </p>
        </section>
      </Box>
    </div>
  </div>
</template>
