import { describe, expect, it } from 'vitest'
import { timeAgo } from './helper'

const pad = (n: number) => String(n).padStart(2, '0')
const apiFormat = (d: Date) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ` +
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`

describe('timeAgo', () => {
  it('parses the API DD/MM/YYYY format the live feeds receive', () => {
    expect(timeAgo(apiFormat(new Date(Date.now() - 5_000)))).toBe('just now')
    expect(timeAgo(apiFormat(new Date(Date.now() - 2 * 3600_000)))).toBe('2 hours ago')
  })

  it('still parses RFC3339, which the queue resource sends', () => {
    expect(timeAgo(new Date(Date.now() - 5_000).toISOString())).toBe('just now')
  })

  it('never renders "Invalid Date"', () => {
    expect(timeAgo('')).toBe('')
    expect(timeAgo('not a date')).toBe('')
  })
})
