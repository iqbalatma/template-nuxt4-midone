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

  OptionUserIndex = 'option.user.index',
  OptionRoleIndex = 'option.role.index',
  OptionPermissionIndex = 'option.permission.index',

  // Two log screens, two capabilities. ActivityLogIndex is the HTTP request
  // history (method, path, status); AuditIndex is the field-change trail
  // (before/after per column). Whoever may see that a request happened is not
  // automatically whoever may read the values it changed.
  ActivityLogIndex = 'management.activity-log.index',
  AuditIndex = 'management.audit.index',
  JobLogIndex = 'management.job-log.index',
  CacheShow = 'management.cache.show',
  CacheDestroy = 'management.cache.destroy',

  // Creating an M2M client hands out a working credential and regenerating a
  // secret cuts off whatever holds the old one, hence the CRUD split rather
  // than one "manage".
  M2MClientIndex = 'management.m2m-client.index',
  M2MClientShow = 'management.m2m-client.show',
  M2MClientCreate = 'management.m2m-client.create',
  M2MClientUpdate = 'management.m2m-client.update',
  M2MClientDelete = 'management.m2m-client.delete',

  // Reading a board and acting on it are separate: a retry re-runs whatever
  // the job does, which is not the same capability as looking at a list.
  QueueIndex = 'management.queue.index',
  QueueManage = 'management.queue.manage',
  ScheduleIndex = 'management.schedule.index',
  ScheduleManage = 'management.schedule.manage',
}
