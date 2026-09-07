import type { JobStatus } from '~/types/entities/job_log'

/**
 * Badge variants shared by a list and its live feed panel. They live here
 * because the two render the same row twice: a copy in each drifted, and the
 * same request showed up green in one and grey in the other.
 */

/** 2xx green, 4xx amber, 5xx red — the same split ErrorHandler logs on. */
export const httpStatusVariant = (status: number) => {
  if (status >= 500) return 'danger'
  if (status >= 400) return 'warning'
  return 'success'
}

export const httpMethodVariant = (method: string) => {
  if (method === 'DELETE') return 'danger'
  if (method === 'POST') return 'success'
  return 'secondary'
}

export const jobStatusVariant = (status: JobStatus) => (status === 'failed' ? 'danger' : 'success')
