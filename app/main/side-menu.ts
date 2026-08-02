import { type Icon } from '@/base/ui/lucide'

export interface Menu {
  icon?: Icon
  title?: string
  route_name?: string
  params?: any
  badge?: number
  sub_menu?: Menu[]
}

const mainMenu: (string | Menu)[] = [
  "MAIN MENU",
  {
    icon: 'LayoutDashboard',
    route_name: '/',
    title: 'Dashboard',
  },
  'RBAC',
  {
    icon: 'UserLock',
    route_name: 'rbac/roles',
    title: 'Roles',
  },
  {
    icon: 'Shield',
    route_name: 'rbac/permissions',
    title: 'Permissions',
  },
]

export default mainMenu
