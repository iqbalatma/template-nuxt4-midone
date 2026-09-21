/** Mirrors `audit.TrailResource` in the Go API. One changed record. */
export interface AuditTrail {
  id: string
  object_table: string
  object_id: string
  before: unknown
  after: unknown
  tag: unknown
  additional: unknown
}

/**
 * Mirrors `audit.Resource` in the Go API. One row per audited action — a
 * mutation a service explicitly recorded with go-audit, with the fields it
 * moved in `trails`. Distinct from ActivityLog, which is one row per mutating
 * HTTP request and says nothing about which columns changed.
 *
 * Not a BaseEntity: an audit row is append-only and never updated, so it has no
 * meaningful updated_at. `trails` is empty for an action that recorded a header
 * with no field change.
 */
export default interface Audit {
  id: string
  action: string
  message: string
  app_name: string
  actor_table: string
  actor_id: string
  actor_name: string
  actor_email: string
  actor_phone: string
  ip_address: string
  method: string
  endpoint: string
  user_agent: string
  entry_object_table: string
  entry_object_id: string
  tag: unknown
  additional: unknown
  trails: AuditTrail[]
  created_at: string
}
