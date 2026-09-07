import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const DOMAINS = ['common', 'nav', 'account', 'system', 'quick-search', 'profile', 'notifications', 'privacy-policy', 'terms']

const load = (locale: string) =>
  Object.assign(
    {},
    ...DOMAINS.map((d) => JSON.parse(readFileSync(`i18n/locales/${locale}/${d}.json`, 'utf8'))),
  )

const flatten = (obj: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? flatten(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  )

// Read as text rather than importing: these modules pull in .vue files that
// only Nuxt's build can resolve, and the string literals are all we need.
const menuKeys = (file: string) =>
  [...readFileSync(file, 'utf8').matchAll(/'((?:nav|account|system|profile)\.[\w.]+)'/g)].map(
    (m) => m[1]!,
  )

describe('locales', () => {
  it('define the same keys in every locale', () => {
    expect(flatten(load('id')).sort()).toEqual(flatten(load('en')).sort())
  })

  it('translate every menu title', () => {
    const keys = flatten(load('en'))
    const used = [
      ...menuKeys('app/main/side-menu.ts'),
      ...menuKeys('app/main/top-menu.ts'),
      ...menuKeys('app/main/section-menu.ts'),
    ]

    expect(used.length).toBeGreaterThan(0)
    for (const key of used) expect(keys, key).toContain(key)
  })
})
