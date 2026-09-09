/** Mirrors `queue.Status` in the Go API. */
export type QueueJobStatus = 'pending' | 'running' | 'success' | 'failed' | 'canceled'

/**
 * Mirrors `queue.Resource` — one dispatched unit of background work, and its
 * *current* state. Its individual attempts are JobLog rows of type `queue`.
 *
 * Timestamps come in pairs: the raw RFC3339 value to compute with (relative
 * times, a duration ticking up on a running job) and an `f_` twin already
 * formatted by the API for display.
 */
export default interface QueueJob {
  id: string
  queue: string
  name: string
  status: QueueJobStatus
  attempts: number
  max_attempts: number
  last_error: string | null
  /**
   * Null for a job with no arguments *and* for a handler that declares its
   * payload sensitive - `payload_redacted` tells the two apart. The queue
   * screen is readable by anyone with management.queue.index, so a secret
   * (a reset link, a one-time token) is never sent here.
   */
  payload: Record<string, unknown> | null
  payload_redacted: boolean
  /** Wall time of the last completed attempt; null until one finishes. */
  duration_ms: number | null
  dispatched_by: string | null

  created_at: string
  available_at: string
  started_at: string | null
  finished_at: string | null
  f_created_at: string
  f_available_at: string
  f_started_at: string | null
  f_finished_at: string | null
}

export interface QueueDepth {
  queue: string
  pending: number
  running: number
  failed: number
}

export interface QueueNameBreakdown {
  name: string
  pending: number
  running: number
  failed: number
  success: number
}

/**
 * Mirrors `queue.Stats` — how much work is waiting right now. A different
 * question from JobStats, which is how the work that already ran went: a queue
 * can have a perfect success rate and still be an hour behind.
 */
export interface QueueStats {
  pending: number
  running: number
  failed: number
  success: number
  canceled: number
  /** Pending but not yet claimable — a delayed dispatch or a retry in backoff. */
  delayed: number
  /** Age of the oldest *claimable* job: the number that says whether workers keep up. */
  oldest_pending_seconds: number | null
  by_queue: QueueDepth[]
  by_name: QueueNameBreakdown[]
  /** Every registered handler, from the code rather than the table. */
  handlers: string[]
  queues: string[]
}
