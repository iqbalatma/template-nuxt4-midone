/**
 * Mirrors `enums/permission.go` in the Go API. Keep the two in step: the
 * backend gates routes on these exact strings, and the frontend uses them to
 * decide what to render. A name that exists in only one of the two files is a
 * menu entry that 403s, or a route nobody can reach.
 */
export enum Permission {
  UserIndex = 'user.index',
  UserShow = 'user.show',
  UserCreate = 'user.create',
  UserUpdate = 'user.update',
  UserDelete = 'user.delete',

  RoleIndex = 'role.index',
  RoleShow = 'role.show',
  RoleCreate = 'role.create',
  RoleUpdate = 'role.update',
  RoleDelete = 'role.delete',

  PermissionIndex = 'permission.index',
  PermissionShow = 'permission.show',
  PermissionCreate = 'permission.create',
  PermissionUpdate = 'permission.update',
  PermissionDelete = 'permission.delete',

  OptionRoleIndex = 'option.role.index',
  OptionPermissionIndex = 'option.permission.index',

  AuditIndex = 'management.audit.index',
  JobLogIndex = 'management.job-log.index',
  CacheShow = 'management.cache.show',
  CacheDestroy = 'management.cache.destroy',

  // Reading a board and acting on it are separate: a retry re-runs whatever
  // the job does, which is not the same capability as looking at a list.
  QueueIndex = 'management.queue.index',
  QueueManage = 'management.queue.manage',
  ScheduleIndex = 'management.schedule.index',
  ScheduleManage = 'management.schedule.manage',
}
