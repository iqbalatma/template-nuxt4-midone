import type { Icon } from '@/base/ui/lucide'

export interface Menu {
  icon?: Icon
  /** i18n key, resolved with $t at render time (see base/top-menu). */
  title?: string
  route_name?: string
  params?: any
  badge?: number
  sub_menu?: Menu[]
}

// NOTE: TopMenu navigates by Nuxt route *name* (router.push({ name })), unlike
// SideMenu which navigates by path. Names are derived from the file path,
// e.g. app/pages/account/roles.vue -> 'account-roles'.
const mainMenu: Array<Menu> = [
  {
    icon: 'LayoutDashboard',
    route_name: 'index',
    title: 'nav.items.dashboard',
  },
  {
    icon: 'UserRoundCog',
    title: 'nav.items.account',
    sub_menu: [
      {
        icon: 'UsersRound',
        route_name: 'account-users',
        title: 'nav.items.users',
      },
      {
        icon: 'UserLock',
        route_name: 'account-roles',
        title: 'nav.items.roles',
      },
      {
        icon: 'Shield',
        route_name: 'account-permissions',
        title: 'nav.items.permissions',
      },
    ],
  },
  {
    icon: 'Settings',
    title: 'nav.items.system',
    sub_menu: [
      {
        icon: 'ScrollText',
        route_name: 'system-audits',
        title: 'nav.items.audits',
      },
      {
        icon: 'Timer',
        route_name: 'system-job-logs',
        title: 'nav.items.jobLogs',
      },
      {
        icon: 'DatabaseZap',
        route_name: 'system-cache',
        title: 'nav.items.cache',
      },
    ],
  },
]

export default mainMenu
