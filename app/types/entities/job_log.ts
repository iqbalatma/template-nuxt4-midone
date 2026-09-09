/** Mirrors `joblog.Type` / `joblog.Status` in the Go API. */
export type JobType = 'schedule' | 'queue'

/**
 * `skipped` is a scheduled run that never started because the previous one was
 * still going. Deliberately not `failed` — nothing went wrong, the job is just
 * slower than its own schedule — which is why the success rate below ignores it.
 */
export type JobStatus = 'success' | 'failed' | 'skipped'

/** Mirrors `joblog.Resource` - one run of a background job. */
export default interface JobLog {
  id: string
  type: JobType
  name: string
  status: JobStatus
  message: string | null
  started_at: string
  finished_at: string | null
}

/**
 * Mirrors `joblog.Definition` — a job that can appear in this table, whether or
 * not it ever has. It carries no schedule: when a scheduled job runs is an
 * editable row now, and a copy here would be the stale one.
 */
export interface JobDefinition {
  type: JobType
  name: string
}

/** The windows `GET /api/management/job-logs/stats` accepts. */
export type JobStatsRange = '24h' | '7d' | '30d'

export interface JobStatsSummary {
  total: number
  success: number
  failed: number
  skipped: number
  /** Over success+failed only — a skipped run neither worked nor broke. */
  success_rate: number
  /** Fractional milliseconds: most jobs here finish in microseconds. */
  avg_duration_ms: number
  max_duration_ms: number
}

/** One bucket of the trend chart. `bucket` is a display label, already in the API's timezone. */
export interface JobTrendPoint {
  bucket: string
  success: number
  failed: number
  skipped: number
}

export interface JobRollup {
  type: JobType
  name: string
  total: number
  success: number
  failed: number
  skipped: number
  avg_duration_ms: number
  max_duration_ms: number
  last_run_at: string | null
  f_last_run_at: string | null
  last_status: JobStatus | null
}

/** Mirrors `joblog.Stats` — how the work that already ran went. */
export interface JobStats {
  range: JobStatsRange
  summary: JobStatsSummary
  trend: JobTrendPoint[]
  by_job: JobRollup[]
}
