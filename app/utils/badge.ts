import type { JobStatus } from '~/types/entities/job_log'
import type { QueueJobStatus } from '~/types/entities/queue_job'

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

/**
 * A skipped run is amber, not red: nothing went wrong, the job was simply
 * still running when its next tick came round. Colouring it as a failure would
 * send someone looking for a bug that is not there.
 */
export const jobStatusVariant = (status: JobStatus) => {
  if (status === 'failed') return 'danger'
  if (status === 'skipped') return 'warning'
  return 'success'
}

/**
 * Queue statuses carry more states than a run does, because a queue job exists
 * before and between its attempts. `pending` and `running` are deliberately
 * distinct: waiting and working look the same on a list otherwise, and telling
 * them apart is most of what a queue board is for.
 */
export const queueStatusVariant = (status: QueueJobStatus) => {
  switch (status) {
    case 'failed':
      return 'danger'
    case 'running':
      return 'primary'
    case 'pending':
      return 'pending'
    case 'canceled':
      return 'secondary'
    default:
      return 'success'
  }
}
