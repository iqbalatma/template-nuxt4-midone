import { debounce as debounceFn } from 'lodash'
import type { WatchSource } from 'vue'
import type { LocationQueryRaw } from 'vue-router'
import { getDefaultPage, getDefaultPerPage } from '~/utils/helper'

type FilterValues = Record<string, string>

interface Options<F extends FilterValues> {
  /**
   * Filter keys with their "empty" default. The keys double as query-param
   * names, so `{ search: '' }` reads and writes `?search=`.
   */
  filters?: F
  /** Keys whose URL sync is debounced — use it for free-text inputs. */
  debounce?: (keyof F & string)[]
  /** Delay for those keys. */
  debounceMs?: number
  /** Runs on mount and on every page, per-page or filter change. */
  fetch: (page: number, perPage: number, filters: F) => unknown
}

/**
 * Query-string driven state for a `ServerSidePagination` list.
 *
 * The URL is the single source of truth: inputs only ever write to it, and one
 * watcher turns it into a request. That keeps back/forward and shared links
 * working, and makes a double fetch impossible — no page syncs the URL *and*
 * calls the service side by side.
 *
 * ```ts
 * const { filters, hasActiveFilters, reset, refresh } = useServerList({
 *   filters: { search: '', status: '' },
 *   debounce: ['search'],
 *   fetch: (page, per_page, applied) => getAllPaginated({ page, per_page, ...applied }),
 * })
 * ```
 *
 * Bind `filters.*` with `v-model`, call `reset()` from the Reset button and
 * `refresh()` after a mutation.
 */
export const useServerList = <F extends FilterValues>(options: Options<F>) => {
  const route = useRoute()
  const router = useRouter()

  const defaults = { ...(options.filters ?? ({} as F)) }
  const keys = Object.keys(defaults) as (keyof F & string)[]
  const debouncedKeys = new Set<string>(options.debounce ?? [])

  const page = computed(() => Number(route.query['page']) || getDefaultPage())
  const perPage = computed(() => Number(route.query['per_page']) || getDefaultPerPage())

  /** What the URL asks for — the only filter values `fetch` ever sees. */
  const applied = computed(() => {
    const values = { ...defaults }
    for (const key of keys) {
      const value = route.query[key]
      if (typeof value === 'string') values[key] = value as F[typeof key]
    }
    return values
  })

  // Local mirror for the inputs, so typing stays instant while the URL sync is
  // debounced.
  const filters = reactive({ ...applied.value }) as F

  const hasActiveFilters = computed(() => keys.some((key) => filters[key] !== defaults[key]))

  // Guards the mirror → URL watchers while we push the URL into the mirror
  // (back/forward, reset); without it the two would ping-pong.
  let syncingFromUrl = false

  const writeToUrl = () => {
    const query: LocationQueryRaw = { ...route.query, page: 1 }
    for (const key of keys) query[key] = filters[key] || undefined
    router.replace({ query })
  }

  const writeToUrlDebounced = debounceFn(writeToUrl, options.debounceMs ?? 500)

  for (const key of keys) {
    watch(
      () => filters[key],
      () => {
        if (syncingFromUrl) return
        if (debouncedKeys.has(key)) return writeToUrlDebounced()
        // `writeToUrl` already carries the current search text, so a pending
        // keystroke has nothing left to add — dropping it avoids a second
        // navigation 500ms later.
        writeToUrlDebounced.cancel()
        writeToUrl()
      },
    )
  }

  // URL → mirror, so back/forward (and `reset`) move the inputs as well.
  watch(applied, async (values) => {
    if (keys.every((key) => filters[key] === values[key])) return
    syncingFromUrl = true
    Object.assign(filters, values)
    // Mirror watchers flush before this resumes, so they see the guard.
    await nextTick()
    syncingFromUrl = false
  })

  /** Refetch the current page — call it after a create/update/delete. */
  const refresh = () => options.fetch(page.value, perPage.value, applied.value)

  watch([page, perPage, applied] as WatchSource[], refresh, { immediate: true })

  /** Clear every filter and go back to page 1, keeping the per-page choice. */
  const reset = () => {
    writeToUrlDebounced.cancel()
    syncingFromUrl = true
    Object.assign(filters, defaults)
    nextTick(() => {
      syncingFromUrl = false
    })
    router.replace({ query: { per_page: route.query['per_page'] } })
  }

  onUnmounted(() => writeToUrlDebounced.cancel())

  return { page, perPage, filters, applied, hasActiveFilters, refresh, reset }
}
