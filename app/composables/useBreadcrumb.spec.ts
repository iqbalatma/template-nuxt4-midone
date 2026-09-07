import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const route = ref({ path: '/' })

vi.mock('vue-router', () => ({ useRoute: () => route.value }))
// Identity translator: the assertions read the i18n keys, so a renamed label
// in the locale files does not break this test.
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }))

const { useBreadcrumb } = await import('./useBreadcrumb')

const at = (path: string) => {
  route.value = { path }
  return useBreadcrumb().value
}

describe('useBreadcrumb', () => {
  it('prefixes the menu entry with its group label', () => {
    expect(at('/')).toEqual(['nav.groups.mainMenu', 'nav.items.dashboard'])
  })

  it('adds the section entry the side menu does not list', () => {
    // /account and /system are shell pages: the page on screen is one of the
    // section menus under them, so the leaf comes from section-menu.ts.
    expect(at('/system/audits')).toEqual([
      'nav.groups.management',
      'nav.items.system',
      'system.nav.auditsTitle',
    ])
    expect(at('/account/roles')).toEqual([
      'nav.groups.management',
      'nav.items.account',
      'account.nav.rolesTitle',
    ])
  })

  it('keeps the entry that owns a nested route with no section of its own', () => {
    expect(at('/system/audits/7')).toEqual(['nav.groups.management', 'nav.items.system'])
  })

  it('falls back to path segments when nothing in the menu matches', () => {
    expect(at('/some/unlisted-page')).toEqual(['Some', 'Unlisted Page'])
    // /profile is not in the side menu - it is reached from the account menu.
    expect(at('/profile/detail')).toEqual(['Profile', 'Detail'])
  })
})
