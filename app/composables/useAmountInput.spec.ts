import { describe, expect, it } from 'vitest'
import * as vue from 'vue'
import { useAmountInput } from './useAmountInput'

// The composable leans on Nuxt auto-imports (ref, computed).
Object.assign(globalThis, vue)

// `display` is a writable computed, so it is read and written through `.value`
// here. A template unwraps it, which is why pages bind `v-model="x.display"`.

// The pair that has to stay in step: `raw` is what gets submitted, `display` is
// what is read on screen. A separator leaking into `raw` sends "1.000.000" to
// an API expecting an integer; digits missing from `display` show the wrong
// amount to whoever is approving it.
describe('useAmountInput', () => {
  it('splits a typed value into digits and a formatted display', () => {
    const amount = useAmountInput()
    amount.display.value = '1000000'

    expect(amount.raw.value).toBe('1000000')
    expect(amount.display.value).toBe('1.000.000')
    expect(amount.asNumber.value).toBe(1000000)
  })

  it('strips anything that is not a digit, including its own separators', () => {
    const amount = useAmountInput()
    // What arrives when someone edits an already-formatted field.
    amount.display.value = '1.234.567'

    expect(amount.raw.value).toBe('1234567')
    expect(amount.display.value).toBe('1.234.567')
  })

  it('treats an empty field as empty rather than zero', () => {
    const amount = useAmountInput(5000)
    expect(amount.display.value).toBe('5.000')

    amount.reset()
    expect(amount.raw.value).toBe('')
    expect(amount.display.value).toBe('')
    // Still 0 as a number, so a submit reads an amount rather than NaN.
    expect(amount.asNumber.value).toBe(0)
  })

  it('accepts a number from a preset button', () => {
    const amount = useAmountInput()
    amount.set(250000)

    expect(amount.raw.value).toBe('250000')
    expect(amount.display.value).toBe('250.000')
  })
})
