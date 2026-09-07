<script setup lang="ts">
import { Box } from '@/base/ui/box'
import { Lucide } from '@/base/ui/lucide'

const props = withDefaults(defineProps<{ iconClass?: string }>(), {
  iconClass: 'cursor-pointer',
})

const { locale, locales, setLocale } = useI18n()

// One line per locale. 'en' is a language, not a country, so it does not fall
// out of the code the way 'id' does - keep them both explicit rather than
// deriving one and special-casing the other.
const flags: Record<string, string> = { en: '🇬🇧', id: '🇮🇩' }

// The codes are a literal union generated from nuxt.config's `locales`, so
// they are typed off `locale` rather than widened to string — setLocale only
// accepts a code the app actually defines.
type LocaleCode = typeof locale.value

const localeOptions = computed(() => locales.value as { code: LocaleCode; name: string }[])

const currentFlag = computed(() => flags[locale.value] ?? '🏳️')

// The plugin reads this back on boot; setLocale alone does not survive a reload.
const switchLocale = async (code: LocaleCode) => {
  await setLocale(code)
  localStorage.setItem('locale', code)
}
</script>

<template>
  <div class="group/language relative flex h-9 items-center">
    <span :class="props.iconClass" class="text-base leading-none" role="img" :aria-label="locale">{{
      currentFlag
    }}</span>
    <div
      class="invisible absolute right-0 top-full z-50 mt-2 origin-top-right scale-95 opacity-0 transition-all delay-0 duration-200 group-hover/language:visible group-hover/language:scale-100 group-hover/language:opacity-100 group-hover/language:delay-200"
    >
      <Box
        class="before:shadow-foreground/5 z-50 flex w-40 flex-col gap-1 p-2 before:rounded-2xl before:shadow-xl before:backdrop-blur after:rounded-2xl"
      >
        <button
          v-for="opt in localeOptions"
          :key="opt.code"
          type="button"
          class="hover:bg-foreground/5 flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm"
          :class="{ 'text-primary font-medium': locale === opt.code }"
          @click="switchLocale(opt.code)"
        >
          <span class="text-base leading-none" aria-hidden="true">{{
            flags[opt.code] ?? '🏳️'
          }}</span>
          {{ opt.name }}
          <Lucide v-if="locale === opt.code" icon="Check" class="!size-3.5 ml-auto" />
        </button>
      </Box>
    </div>
  </div>
</template>
