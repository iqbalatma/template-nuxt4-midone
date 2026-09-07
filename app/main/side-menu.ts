import { type Icon } from '@/base/ui/lucide'
import { Permission } from '~/enums/Permission'

export interface Menu {
  icon?: Icon
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
  "MAIN MENU",
  {
    icon: 'LayoutDashboard',
    route_name: '/',
    title: 'Dashboard',
  },
  'MANAGEMENT',
  {
    icon: 'UsersRound',
    route_name: 'management/users',
    title: 'Users',
    permission: Permission.UserIndex,
  },
  {
    icon: 'ScrollText',
    route_name: 'management/audits',
    title: 'Audit Trail',
    permission: Permission.AuditIndex,
  },
  {
    icon: 'Timer',
    route_name: 'management/job-logs',
    title: 'Job Runs',
    permission: Permission.JobLogIndex,
  },
  {
    icon: 'DatabaseZap',
    route_name: 'management/cache',
    title: 'Cache',
    permission: Permission.CacheShow,
  },
  {
    icon: 'Bell',
    route_name: 'notifications',
    title: 'Notifications',
  },
  'RBAC',
  {
    icon: 'UserLock',
    route_name: 'rbac/roles',
    title: 'Roles',
    permission: Permission.RoleIndex,
  },
  {
    icon: 'Shield',
    route_name: 'rbac/permissions',
    title: 'Permissions',
    permission: Permission.PermissionIndex,
  },
]

export default mainMenu
