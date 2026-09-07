import type User from '~/types/entities/user'

/**
 * Mirrors `activitylog.Resource` in the Go API. One row per mutating HTTP
 * request. `user` is null for requests made without a token, and the bodies are
 * already redacted and truncated server-side by `activitylog.SanitizeBody`.
 */
export default interface ActivityLog {
  id: string
  user: User | null
  method: string
  path: string
  status_code: number
  ip: string
  request_body: string | null
  response_body: string | null
  created_at: string
  updated_at: string
}
