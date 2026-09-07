/** Mirrors `joblog.Type` / `joblog.Status` in the Go API. */
export type JobType = 'schedule' | 'queue'
export type JobStatus = 'success' | 'failed'

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

/** Mirrors `joblog.Definition` - a registered job and how often it runs. */
export interface JobDefinition {
  type: JobType
  name: string
  interval: string
}
