import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const permissionNames = ref<string[]>([])

// Identity translator: assertions read the i18n keys, so renaming a label in
// the locale files does not break this test.
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }))
// storeToRefs only unwraps a real store; the stub below already exposes a ref.
vi.mock('pinia', () => ({ storeToRefs: (store: unknown) => store }))
vi.mock('~/stores/auth', () => ({ useAuthStore: () => ({ permissionNames }) }))

const { useSearchablePages } = await import('./useQuickSearch')

const pagesFor = (...permissions: string[]) => {
  permissionNames.value = permissions
  return useSearchablePages().pages.value.map((page) => page.path)
}

describe('useSearchablePages', () => {
  it('offers only the pages the user may open', () => {
    // No permissions at all: the ungated menu entries, plus the profile pages
    // every authenticated user owns.
    expect(pagesFor()).toEqual(['/', '/notifications', '/profile/detail', '/profile/password'])

    // user.index unlocks the /account shell and the one list under it — but
    // not its siblings, which answer to their own permissions.
    expect(pagesFor('user.index')).toEqual([
      '/',
      '/notifications',
      '/account',
      '/account/users',
      '/profile/detail',
      '/profile/password',
    ])
  })

  it('reaches the sub-pages the side menu does not list', () => {
    // /system/cache has no side-menu entry of its own; without section-menu.ts
    // in the list it would be unreachable from the quick search.
    expect(pagesFor('management.audit.index', 'management.cache.show')).toContain('/system/cache')
  })

  it('matches on the label and caps the result count', () => {
    permissionNames.value = ['user.index', 'role.index', 'permission.index']
    const { search } = useSearchablePages()

    expect(search('usersTitle').map((page) => page.path)).toEqual(['/account/users'])
    // A blank query is the dialog's resting state, not a match-everything.
    expect(search('   ')).toEqual([])
    expect(search('account', 2)).toHaveLength(2)
  })
})
