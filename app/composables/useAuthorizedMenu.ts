import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

/**
 * The only two fields this composable reads. Generic rather than a concrete
 * type so the base menu components stay independent of the app's own menu
 * definition - each passes its own item type and gets the same type back.
 */
interface MenuItem {
  permission?: string
  sub_menu?: MenuItem[]
}

/**
 * Hides menu entries the user has no permission for, and drops any group label
 * left with nothing under it - a "MANAGEMENT" heading above an empty gap reads
 * as a broken page rather than a hidden feature.
 *
 * This is presentation only. The API gates every one of these routes itself
 * with middleware.RequirePermission, so a hidden entry is a courtesy, never the
 * security boundary. An entry with no `permission` is always visible.
 */
export const useAuthorizedMenu = <T extends MenuItem>(
  menu: MaybeRefOrGetter<(string | T)[]>,
): ComputedRef<(string | T)[]> => {
  // Read through the ref, not the store action, so the list recomputes when
  // fetchMe fills the permissions in after the first paint.
  const { permissionNames } = storeToRefs(useAuthStore())

  const isVisible = (item: MenuItem): boolean => {
    // A parent is worth showing only if at least one child survived.
    if (item.sub_menu?.length) return item.sub_menu.some(isVisible)
    if (!item.permission) return true
    return permissionNames.value.includes(item.permission)
  }

  return computed(() => {
    const visible: (string | T)[] = []

    for (const item of toValue(menu)) {
      if (typeof item === 'string') {
        visible.push(item)
        continue
      }
      if (!isVisible(item)) continue

      visible.push(
        item.sub_menu?.length ? { ...item, sub_menu: item.sub_menu.filter(isVisible) } : item,
      )
    }

    // Second pass: a label followed immediately by another label, or sitting at
    // the end of the list, has no items of its own left.
    return visible.filter((item, index) => {
      if (typeof item !== 'string') return true
      const next = visible[index + 1]
      return next !== undefined && typeof next !== 'string'
    })
  })
}
