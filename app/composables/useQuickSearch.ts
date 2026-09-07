import { computed, ref, onMounted, onUnmounted, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Icon } from '@/base/ui/lucide'
import mainMenu, { type Menu } from '@/main/side-menu'
import { accountMenus, profileMenus, systemMenus, type SectionMenu } from '@/main/section-menu'
import { useAuthorizedMenu } from '~/composables/useAuthorizedMenu'

/**
 * Label for the open shortcut. Apple keyboards carry Command where every other
 * one carries Control, so a hardcoded `⌘K` is wrong on most machines — and a
 * shortcut hint that names a key the reader does not have is worse than none.
 *
 * Resolved on mount rather than at import time: `navigator` does not exist
 * while the app is being built.
 */
const shortcutLabel = ref('Ctrl K')

const resolveShortcutLabel = () => {
  if (!import.meta.client) return
  const platform = navigator.userAgent
  shortcutLabel.value = /Mac|iPhone|iPad|iPod/.test(platform) ? '⌘K' : 'Ctrl K'
}

export const useQuickSearch = () => {
  const quickSearchDialogOpen = ref(false)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'k') {
        event.preventDefault()
        quickSearchDialogOpen.value = true
      }
    }

    if (event.key === 'Escape') {
      quickSearchDialogOpen.value = false
    }
  }

  onMounted(() => {
    resolveShortcutLabel()
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    quickSearchDialogOpen,
    shortcutLabel,
  }
}

/** A page the quick search can jump to. `title` is an i18n key, as in the menus. */
export interface SearchablePage {
  title: string
  path: string
  icon?: Icon
}

/** '/' is the index route; every other menu entry is its route_name as a path. */
const menuPath = (routeName: string) => (routeName === '/' ? '/' : `/${routeName}`)

/**
 * Every page the current user may open, from the same two menu definitions the
 * navigation itself renders - the side menu for the shells, the section menus
 * for what sits under them. No third list to keep in step.
 *
 * Filtered through `useAuthorizedMenu`, so a page the user has no permission
 * for is never offered: the API would answer 403, and a search result that
 * fails on click is worse than one that never appeared.
 */
export const useSearchablePages = () => {
  const { t } = useI18n()
  const authorizedMenu = useAuthorizedMenu<Menu>(() => mainMenu)
  const authorizedAccount = useAuthorizedMenu<SectionMenu>(() => accountMenus)
  const authorizedSystem = useAuthorizedMenu<SectionMenu>(() => systemMenus)
  const authorizedProfile = useAuthorizedMenu<SectionMenu>(() => profileMenus)

  const pages: ComputedRef<SearchablePage[]> = computed(() => {
    const collected: SearchablePage[] = []

    // Group labels are plain strings in the menu, and a parent with sub_menu
    // entries is a container rather than a route of its own.
    const walk = (items: (string | Menu)[]) => {
      for (const item of items) {
        if (typeof item === 'string') continue
        if (item.route_name && item.title) {
          collected.push({ title: item.title, path: menuPath(item.route_name), icon: item.icon })
        }
        if (item.sub_menu) walk(item.sub_menu)
      }
    }
    walk(authorizedMenu.value)

    for (const item of [
      ...authorizedAccount.value,
      ...authorizedSystem.value,
      ...authorizedProfile.value,
    ]) {
      if (typeof item === 'string') continue
      collected.push({ title: item.title, path: item.to, icon: item.icon })
    }

    return collected
  })

  /**
   * Matches on the translated label rather than the i18n key: searching in
   * Indonesian, or for a word that only exists in the label ("Log" in
   * "Activity Log"), finds nothing otherwise.
   */
  const search = (query: string, limit = 5): SearchablePage[] => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return pages.value
      .filter((page) => t(page.title).toLowerCase().includes(needle))
      .slice(0, limit)
  }

  return { pages, search }
}
