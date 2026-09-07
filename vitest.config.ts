import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'

export default mergeConfig(
  [],
  defineConfig({
    // Nuxt supplies these at build time; vitest runs outside it and needs its
    // own copy, or any spec touching app code fails to resolve '@/...'.
    resolve: {
      alias: {
        '@assets': fileURLToPath(new URL('./app/assets', import.meta.url)),
        '@midoneui': fileURLToPath(new URL('./app/base/ui', import.meta.url)),
        '@': fileURLToPath(new URL('./app', import.meta.url)),
        '~': fileURLToPath(new URL('./app', import.meta.url)),
      },
    },
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
