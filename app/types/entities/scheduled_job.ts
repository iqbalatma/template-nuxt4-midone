/**
 * Mirrors `scheduler.Resource` — a periodic job's schedule and how its last run
 * went.
 *
 * `next_run_at` is computed by the API from the cron expression on every read,
 * never stored, so it always reflects the expression currently saved. It is
 * null for a disabled job (nothing is coming) and for an expression that cannot
 * fire; `cron_error` distinguishes an unparseable expression from those.
 */
export default interface ScheduledJob {
  id: string
  name: string
  cron_expression: string
  enabled: boolean

  next_run_at: string | null
  f_next_run_at: string | null
  cron_error: string | null

  last_run_at: string | null
  f_last_run_at: string | null
  last_status: string | null
  last_message: string | null
  last_duration_ms: number | null
}
