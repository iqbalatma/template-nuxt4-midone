import { describe, expect, it, vi } from 'vitest'
import * as vue from 'vue'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter, useRoute, useRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import { useServerList } from './useServerList'

// The composable leans on Nuxt auto-imports (ref, computed, watch, useRoute…),
// which vitest does not provide — expose them as globals instead of stubbing
// the composable's own behaviour.
Object.assign(globalThis, vue, { useRoute, useRouter })

// router.replace and the debounce both settle asynchronously, and a filter
// change goes mirror → URL → applied → fetch. One tick is not enough.
const settle = async () => {
  for (let i = 0; i < 5; i++) {
    await vue.nextTick()
    await new Promise((resolve) => setTimeout(resolve, 5))
  }
}

const setup = async () => {
  const fetch = vi.fn()
  let api: ReturnType<typeof useServerList<{ search: string; status: string }>>

  const Page = defineComponent({
    setup() {
      api = useServerList({
        filters: { search: '', status: '' },
        debounce: ['search'],
        fetch: (page, perPage, applied) => fetch(page, perPage, { ...applied }),
      })
      return () => h('div')
    },
  })

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: Page }],
  })
  router.push('/system/audits')
  await router.isReady()

  mount(Page, { global: { plugins: [router] } })
  await settle()

  return { fetch, router, api: api! }
}

// The point of this composable is that the URL is the only source of truth, so
// every test here is really one assertion: exactly one request per change. A
// page that syncs the URL *and* calls the service fetches twice, which is the
// bug this design exists to make impossible.
describe('useServerList', () => {
  it('fetches once on mount', async () => {
    const { fetch } = await setup()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenLastCalledWith(1, 10, { search: '', status: '' })
  })

  it('fetches once per filter change and writes it to the URL', async () => {
    const { fetch, api, router } = await setup()
    api.filters.status = 'OPEN'
    await settle()

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenLastCalledWith(1, 10, { search: '', status: 'OPEN' })
    expect(router.currentRoute.value.query['status']).toBe('OPEN')
  })

  it('debounces free-text filters into one request', async () => {
    const { fetch, api } = await setup()
    api.filters.search = 'a'
    await vue.nextTick()
    api.filters.search = 'ab'
    await vue.nextTick()
    api.filters.search = 'abc'
    await new Promise((resolve) => setTimeout(resolve, 700))
    await settle()

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenLastCalledWith(1, 10, { search: 'abc', status: '' })
  })

  it('reset clears the filters, the URL and the inputs in one request', async () => {
    const { fetch, api, router } = await setup()
    api.filters.status = 'OPEN'
    await settle()
    expect(fetch).toHaveBeenCalledTimes(2)

    api.reset()
    await settle()

    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenLastCalledWith(1, 10, { search: '', status: '' })
    expect(router.currentRoute.value.query['status']).toBeUndefined()
    expect(api.filters.status).toBe('')
  })

  it('refetches and syncs the inputs when the URL changes underneath it', async () => {
    const { fetch, api, router } = await setup()

    // A navigation the page did not initiate — a shared link, or back/forward.
    router.push('/system/audits?page=1&status=OPEN')
    await settle()

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenLastCalledWith(1, 10, { search: '', status: 'OPEN' })
    expect(api.filters.status).toBe('OPEN')

    router.back()
    await settle()

    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenLastCalledWith(1, 10, { search: '', status: '' })
    expect(api.filters.status).toBe('')
  })
})
