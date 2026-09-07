import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import mainMenu, { type Menu } from '@/main/side-menu'
import { accountMenus, profileMenus, systemMenus } from '@/main/section-menu'

/**
 * Breadcrumb trail for the current route, read off app/main/side-menu.ts so the
 * menu stays the single source of truth - an entry renamed or moved there moves
 * here too, with no second list to keep in sync.
 *
 * Titles are i18n keys, same as the menu itself. A route with no menu entry
 * (a detail page under a listed one, say) falls back to its own path segments.
 */
export const useBreadcrumb = (): ComputedRef<string[]> => {
  const route = useRoute()
  const { t } = useI18n()

  // Same rule as base/side-menu's active check: '/' only matches itself, every
  // other entry also owns anything nested under it.
  const matches = (routeName: string, path: string) =>
    routeName === '/' ? path === '/' : path === `/${routeName}` || path.startsWith(`/${routeName}/`)

  return computed(() => {
    let group: string | undefined

    const walk = (items: (string | Menu)[], trail: string[]): string[] | undefined => {
      for (const item of items) {
        // Group labels are top-level only, so the last one seen is the section
        // the match below belongs to.
        if (typeof item === 'string') {
          group = item
          continue
        }
        const here = item.title ? [...trail, item.title] : trail
        if (item.route_name && matches(item.route_name, route.path)) return here
        const found = item.sub_menu && walk(item.sub_menu, here)
        if (found) return found
      }
    }

    const trail = walk(mainMenu, [])

    // side-menu.ts only knows the shell pages (/account, /system): the page
    // actually on screen is one of the section menus under them, so the leaf
    // comes from there or the trail stops one level short of where the user is.
    const section = [...accountMenus, ...systemMenus, ...profileMenus].find(
      (item) => item.to === route.path,
    )

    if (trail) {
      return [group, ...trail, section?.title].filter(Boolean).map((key) => t(key as string))
    }

    return route.path
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
  })
}
