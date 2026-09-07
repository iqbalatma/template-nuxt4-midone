import type { Icon } from '@/base/ui/lucide'
import { Permission } from '~/enums/Permission'

export interface Menu {
  icon?: Icon
  /** i18n key, resolved with $t at render time (see base/side-menu). */
  title?: string
  route_name?: string
  params?: any
  badge?: number
  sub_menu?: Menu[]
  /**
   * Hides the entry unless the user holds this permission (see
   * useAuthorizedMenu). Leave it off for an entry everyone may see. The value
   * must match the API's own gate for the route, or the menu will offer a
   * screen that answers 403.
   */
  permission?: Permission
}

const mainMenu: (string | Menu)[] = [
  'nav.groups.mainMenu',
  {
    icon: 'LayoutDashboard',
    route_name: '/',
    title: 'nav.items.dashboard',
  },
  {
    icon: 'Bell',
    route_name: 'notifications',
    title: 'nav.items.notifications',
  },
  'nav.groups.management',
  {
    // /account is a shell page: it owns no list of its own, it just frames
    // users/roles/permissions. One entry here rather than three, because they
    // are one job. The permission is the one its landing page needs — see
    // app/pages/account.vue.
    icon: 'UserRoundCog',
    route_name: 'account',
    title: 'nav.items.account',
    permission: Permission.UserIndex,
  },
  {
    // Same shape as /account: activity log, job runs and the read cache are
    // operator screens, not features. See app/pages/system.vue.
    icon: 'Settings',
    route_name: 'system',
    title: 'nav.items.system',
    permission: Permission.AuditIndex,
  },
]

export default mainMenu
