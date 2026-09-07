import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env['NUXT_PUBLIC_API_BASE'],
    },
  },
  components: true,
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  css: ['@assets/css/index.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    langDir: 'locales',
    strategy: 'no_prefix',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'en',
        name: 'English',
        files: [
          'en/common.json',
          'en/nav.json',
          'en/account.json',
          'en/system.json',
          'en/profile.json',
          'en/notifications.json',
          'en/privacy-policy.json',
          'en/terms.json',
          'en/quick-search.json',
        ],
      },
      {
        code: 'id',
        name: 'Bahasa Indonesia',
        files: [
          'id/common.json',
          'id/nav.json',
          'id/account.json',
          'id/system.json',
          'id/profile.json',
          'id/notifications.json',
          'id/privacy-policy.json',
          'id/terms.json',
          'id/quick-search.json',
        ],
      },
    ],
  },
  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url)),
    '~': fileURLToPath(new URL('./app', import.meta.url)),
    '@assets': fileURLToPath(new URL('./app/assets', import.meta.url)),
    '@midoneui': fileURLToPath(new URL('./app/base/ui', import.meta.url)),
  },
})
