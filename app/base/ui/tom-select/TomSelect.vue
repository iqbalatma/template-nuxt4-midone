<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, useAttrs } from 'vue'
import { input } from '@midoneui/styles/input.styles'

type OptionItem = { id: number | string; name: string }

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | (string | number)[]
    options?: OptionItem[]
    placeholder?: string
    id?: string
    name?: string
    multiple?: boolean
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    placeholder: 'Select...',
    id: undefined,
    name: undefined,
    multiple: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const selectEl = ref<HTMLSelectElement | null>(null)

type TomSelectInstance = {
  setValue: (v: string | string[], silent?: boolean) => void
  destroy: () => void
  clearOptions: () => void
  addOption: (opts: unknown) => void
  refreshOptions: (flag?: boolean) => void
}

const toTomSelectValue = (val: typeof props.modelValue): string | string[] =>
  Array.isArray(val) ? val.map(String) : val === undefined || val === null ? '' : String(val)

let tsInstance: TomSelectInstance | null = null
let tsDropdownEl: HTMLElement | null = null
let resizeHandler: (() => void) | null = null
let scrollHandler: (() => void) | null = null

async function initTomSelect() {
  const module = await import('tom-select')
  try {
    await import('tom-select/dist/css/tom-select.css')
  } catch (err) {
    console.warn('tom-select CSS could not be loaded automatically:', err)
  }
  const TomSelectClass = module.default || module

  const optionItems = (props.options || []).map((o) => ({
    value: String(o.id),
    text: o.name,
  }))

  const TomSelectCtor = TomSelectClass as unknown as {
    new (el: HTMLSelectElement, opts: unknown): TomSelectInstance
  }
  tsInstance = new TomSelectCtor(selectEl.value as HTMLSelectElement, {
    options: optionItems,
    valueField: 'value',
    labelField: 'text',
    searchField: ['text'],
    placeholder: props.placeholder,
    allowEmptyOption: !props.multiple,
    maxItems: props.multiple ? null : 1,
    plugins: props.multiple ? ['remove_button'] : [],
    onChange: (value: string | string[]) => {
      emit('update:modelValue', value)
    },
  })

  if (props.modelValue !== undefined && props.modelValue !== null && tsInstance) {
    tsInstance.setValue(toTomSelectValue(props.modelValue))
  }

  try {
    // Access Tom Select's own DOM elements directly - avoids querySelector conflicts
    // when multiple TomSelect instances exist in the same modal.
    const instAny = tsInstance as unknown as {
      dropdown: HTMLElement | null
      control: HTMLElement | null
      wrapper: HTMLElement | null
      on?: (ev: string, cb: () => void) => void
    }

    tsDropdownEl = instAny.dropdown
    const wrapperEl = instAny.wrapper
    const controlEl = instAny.control // used for position reference

    // Apply project input styles to the wrapper so it carries the border/bg/radius.
    // Do NOT apply to .ts-control - that element's border is forcibly removed in CSS
    // so the inner flex layout doesn't double-border.
    // `input` is an array of class strings in this project, so flatten before splitting.
    if (wrapperEl && input) {
      const cls = (Array.isArray(input) ? input.join(' ') : String(input))
        .split(/\s+/)
        .filter(Boolean)
      wrapperEl.classList.add(...cls, 'ts-custom-input')
    }

    const reposition = () => {
      if (!tsDropdownEl || !controlEl) return
      const rect = controlEl.getBoundingClientRect()
      tsDropdownEl.style.position = 'absolute'
      tsDropdownEl.style.left = rect.left + 'px'
      tsDropdownEl.style.top = rect.bottom + window.scrollY + 'px'
      tsDropdownEl.style.width = rect.width + 'px'
      tsDropdownEl.style.zIndex = '99999'
    }

    // The dropdown is moved to <body> so it is never clipped by a modal's overflow
    const attachDropdown = () => {
      if (!tsDropdownEl) return
      try {
        if (tsDropdownEl.parentElement !== document.body) document.body.appendChild(tsDropdownEl)
      } catch {}
      try {
        tsDropdownEl.style.position = 'absolute'
        tsDropdownEl.style.transform = 'none'
        tsDropdownEl.style.removeProperty('transform')
        tsDropdownEl.style.boxSizing = 'border-box'
        tsDropdownEl.style.right = 'auto'
      } catch {}

      reposition()
      requestAnimationFrame(() => {
        reposition()
        setTimeout(reposition, 50)
      })

      if (!resizeHandler) {
        resizeHandler = () => reposition()
        scrollHandler = () => reposition()
        window.addEventListener('resize', resizeHandler)
        window.addEventListener('scroll', scrollHandler, true)
      }
    }

    if (tsDropdownEl) attachDropdown()

    if (instAny.on) {
      instAny.on('dropdown_open', () => {
        attachDropdown()
        setTimeout(reposition, 0)
        setTimeout(reposition, 100)
        setTimeout(reposition, 300)
      })
    }
  } catch {
    // ignore
  }
}

onMounted(() => {
  initTomSelect().catch((err) => {
    console.error('Failed to load tom-select:', err)
  })
})

onBeforeUnmount(() => {
  if (tsInstance) {
    try {
      tsInstance.destroy()
    } catch {}
    tsInstance = null
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler, true)
    scrollHandler = null
  }
  if (tsDropdownEl && tsDropdownEl.parentElement === document.body) {
    try {
      document.body.removeChild(tsDropdownEl)
    } catch {}
    tsDropdownEl = null
  }
})

watch(
  () => props.options,
  (newOpts) => {
    if (!tsInstance) return
    const optionItems = newOpts.map((o) => ({ value: String(o.id), text: o.name }))
    tsInstance.clearOptions()
    tsInstance.addOption(optionItems)
    tsInstance.refreshOptions(false)
  },
  { deep: true },
)

watch(
  () => props.modelValue,
  (val) => {
    if (!tsInstance) return
    tsInstance.setValue(toTomSelectValue(val))
  },
  { deep: true },
)

const otherAttrs = useAttrs()
</script>

<template>
  <!-- The select element will be upgraded by Tom Select -->
  <select
    ref="selectEl"
    :id="props.id"
    :name="props.name"
    :multiple="props.multiple"
    v-bind="otherAttrs"
  >
    <option value="">{{ props.placeholder }}</option>
    <option v-for="opt in props.options" :key="opt.id" :value="String(opt.id)">
      {{ opt.name }}
    </option>
  </select>
</template>

<style scoped></style>

<!-- All Tom Select styles must be global - TS creates its DOM at runtime outside Vue's template scope -->
<style>
/* .ts-custom-input is the .ts-wrapper - it carries the border/bg/radius via the project input classes.
   Cursor and block display ensure it behaves like a regular input wrapper. */
.ts-custom-input {
  cursor: pointer;
  display: block !important;
  /* Overrides the fixed h-10 height from the shared input classes so the wrapper
     can grow when selected items wrap onto multiple lines. */
  height: auto !important;
  min-height: 2.5rem;
  padding: 0 !important;
}

/* Inner flex container - no border/bg/shadow of its own; those come from the wrapper above */
.ts-custom-input .ts-control {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  flex-wrap: wrap !important;
  border: none !important;
  padding: 0.5rem 0.75rem !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  min-height: 2.5rem !important;
  cursor: pointer !important;
}

/* The search input inside the control - Tom Select 2.x uses a plain <input>, not .ts-input */
.ts-custom-input .ts-control input {
  border: none !important;
  outline: none !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  min-width: 2ch !important;
  line-height: 1 !important;
  align-self: center !important;
}

.ts-custom-input .ts-control input::placeholder {
  color: color-mix(in srgb, var(--color-foreground), transparent 20%);
}

/* Selected item pills - rounded, primary-tinted chips matching the badge style used
   elsewhere in the app, instead of tom-select's default sharp gray boxes. */
.ts-wrapper.multi .ts-control > div {
  display: inline-flex !important;
  align-items: center !important;
  margin: 0 !important;
  padding: 0.125rem 0.625rem !important;
  border-radius: 9999px !important;
  background: color-mix(in oklch, var(--color-primary), transparent 90%) !important;
  color: var(--color-primary) !important;
  border: 0 !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
}

.ts-wrapper.multi .ts-control > div.active {
  background: color-mix(in oklch, var(--color-primary), transparent 78%) !important;
  color: var(--color-primary) !important;
  border: 0 !important;
}

.ts-wrapper.multi.disabled .ts-control > div,
.ts-wrapper.multi.disabled .ts-control > div.active {
  color: color-mix(in srgb, var(--color-foreground), transparent 50%) !important;
  background: color-mix(in srgb, var(--color-foreground), transparent 92%) !important;
}

/* Remove ("x") button inside each pill */
.ts-wrapper.plugin-remove_button .item .remove {
  border-radius: 9999px !important;
  border-left: 0 !important;
  margin-left: 0.25rem !important;
  padding: 0 0.25rem !important;
  color: color-mix(in oklch, var(--color-primary), transparent 30%) !important;
}

.ts-wrapper.plugin-remove_button .item .remove:hover {
  background: color-mix(in oklch, var(--color-primary), transparent 70%) !important;
  color: var(--color-primary) !important;
}

.ts-wrapper.plugin-remove_button:not(.rtl) .item.active .remove {
  border-left: 0 !important;
}

.ts-dropdown {
  z-index: 99999 !important;
}

.ts-dropdown.single {
  border-radius: 12px;
  overflow: hidden;
}

.ts-dropdown .option,
.ts-dropdown .optgroup-header,
.ts-dropdown .no-results,
.ts-dropdown .create {
  padding: 8px 12px !important;
}
</style>