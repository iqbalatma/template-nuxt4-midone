/**
 * Mirrors `notification.Resource` in the Go API. `data` is a free-form payload
 * whose shape depends on `type` - use it to deep-link, and switch on `type` to
 * decide how to read it.
 */
export default interface AppNotification {
  id: string
  type: string
  title: string
  body: string
  data: Record<string, unknown> | null
  is_read: boolean
  created_at: string
  f_created_at: string
}
