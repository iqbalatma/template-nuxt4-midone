import { formatCurrency, onlyNumber } from '~/utils/helper'

/**
 * State for a currency amount field. Keeps two values in step:
 *
 * - `raw`     — digits only, what the API expects (`"1000000"`)
 * - `display` — thousand-separated, what the input shows (`"1.000.000"`)
 *
 * Bind `display` with `v-model` and `onInput` to `@input`, then read `raw` (or
 * `asNumber`) when submitting. `Input` drives its own `v-model` internally, so
 * binding `:value` instead leaves its model empty and every keystroke gets
 * wiped — always use `v-model` here.
 *
 * ```vue
 * <Input v-model="amount.display" @input="amount.onInput" inputmode="numeric" />
 * ```
 */
export const useAmountInput = (initial: number | string = '') => {
  const raw = ref('')
  const formatted = ref('')

  /** Accepts anything a person or a preset button throws at it. */
  const set = (value: number | string) => {
    raw.value = onlyNumber(String(value ?? ''))
    // formatCurrency returns '' for 0, which is what an empty field wants too.
    formatted.value = raw.value ? formatCurrency(Number(raw.value)) : ''
  }

  const display = computed({
    get: () => formatted.value,
    set: (value: string) => set(value),
  })

  /**
   * Reformats the element synchronously instead of waiting for Vue to patch it
   * back on the next tick — that round trip is what makes the field feel like
   * it lags a character behind.
   */
  const onInput = (e: Event) => {
    const el = e.target as HTMLInputElement
    // Measure the caret from the right: separators appearing to its left would
    // otherwise push it out of position on every third digit.
    const fromEnd = el.value.length - (el.selectionStart ?? el.value.length)
    set(el.value)
    el.value = formatted.value
    const caret = Math.max(0, el.value.length - fromEnd)
    el.setSelectionRange(caret, caret)
  }

  const reset = () => set('')

  const asNumber = computed(() => Number(raw.value || 0))

  set(initial)

  return { raw, display, asNumber, set, onInput, reset }
}
