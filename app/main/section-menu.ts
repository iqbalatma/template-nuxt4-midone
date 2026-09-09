import type { Icon } from '@/base/ui/lucide'
import { Permission } from '~/enums/Permission'

/** One entry in a shell page's left-hand nav (see components/SectionNav.vue). */
export interface SectionMenu {
  title: string
  description: string
  to: string
  icon: Icon
  permission?: Permission
}

// These live here rather than inside account.vue / system.vue because the
// navbar quick search searches them too — the sub-pages are most of what this
// app actually has, and side-menu.ts only knows about the two shells above
// them. One list, so a page added here is findable and navigable at once.

/** Adding an account resource = one entry here + one page file under account/. */
export const accountMenus: SectionMenu[] = [
  {
    title: 'account.nav.usersTitle',
    description: 'account.nav.usersDescription',
    to: '/account/users',
    icon: 'UsersRound',
    permission: Permission.UserIndex,
  },
  {
    title: 'account.nav.rolesTitle',
    description: 'account.nav.rolesDescription',
    to: '/account/roles',
    icon: 'UserLock',
    permission: Permission.RoleIndex,
  },
  {
    title: 'account.nav.permissionsTitle',
    description: 'account.nav.permissionsDescription',
    to: '/account/permissions',
    icon: 'Shield',
    permission: Permission.PermissionIndex,
  },
]

/** Adding a system resource = one entry here + one page file under system/. */
export const systemMenus: SectionMenu[] = [
  {
    title: 'system.nav.auditsTitle',
    description: 'system.nav.auditsDescription',
    to: '/system/audits',
    icon: 'ScrollText',
    permission: Permission.AuditIndex,
  },
  // The dashboard first among the background-job screens: it is the one that
  // says whether anything is wrong, and the other three are where you go once
  // it says something is.
  {
    title: 'system.nav.jobsTitle',
    description: 'system.nav.jobsDescription',
    to: '/system/jobs',
    icon: 'ChartColumn',
    permission: Permission.JobLogIndex,
  },
  {
    title: 'system.nav.queueTitle',
    description: 'system.nav.queueDescription',
    to: '/system/queue',
    icon: 'Layers',
    permission: Permission.QueueIndex,
  },
  {
    title: 'system.nav.schedulesTitle',
    description: 'system.nav.schedulesDescription',
    to: '/system/schedules',
    icon: 'CalendarClock',
    permission: Permission.ScheduleIndex,
  },
  {
    title: 'system.nav.jobLogsTitle',
    description: 'system.nav.jobLogsDescription',
    to: '/system/job-logs',
    icon: 'Timer',
    permission: Permission.JobLogIndex,
  },
  {
    title: 'system.nav.cacheTitle',
    description: 'system.nav.cacheDescription',
    to: '/system/cache',
    icon: 'DatabaseZap',
    permission: Permission.CacheShow,
  },
]

/**
 * The user acting on itself, so neither entry carries a permission: the API
 * takes the id from the token and everyone owns their own profile.
 */
export const profileMenus: SectionMenu[] = [
  {
    title: 'profile.nav.detailTitle',
    description: 'profile.nav.detailDescription',
    to: '/profile/detail',
    icon: 'UserRound',
  },
  {
    title: 'profile.nav.passwordTitle',
    description: 'profile.nav.passwordDescription',
    to: '/profile/password',
    icon: 'KeyRound',
  },
]
