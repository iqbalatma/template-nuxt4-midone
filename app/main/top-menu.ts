import { type Icon } from '@/base/ui/lucide'

export interface Menu {
  icon?: Icon
  title?: string
  route_name?: string
  params?: any
  badge?: number
  sub_menu?: Menu[]
}

// NOTE: TopMenu navigates by Nuxt route *name* (router.push({ name })), unlike
// SideMenu which navigates by path. Names are derived from the file path,
// e.g. app/pages/rbac/roles.vue -> 'rbac-roles'.
const mainMenu: Array<Menu> = [
  {
    icon: 'LayoutDashboard',
    route_name: 'index',
    title: 'Dashboard',
  },
  {
    icon: 'ShieldCheck',
    title: 'RBAC',
    sub_menu: [
      {
        icon: 'UserLock',
        route_name: 'rbac-roles',
        title: 'Roles',
      },
      {
        icon: 'Shield',
        route_name: 'rbac-permissions',
        title: 'Permissions',
      },
    ],
  },
]

export default mainMenu
