<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    /** An array turns this into a multi-select entry; a boolean makes it a single toggle */
    modelValue?: (string | number)[] | boolean | null
    value?: string | number
    label?: string
    description?: string | null
    disabled?: boolean
    class?: string
  }>(),
  {
    modelValue: false,
    class: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[] | boolean]
}>()

const isMultiple = computed(() => Array.isArray(props.modelValue))

const checked = computed<boolean>({
  get() {
    if (isMultiple.value && Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.value as string | number)
    }
    return !!props.modelValue
  },
  set(isChecked: boolean) {
    if (!isMultiple.value) {
      emit('update:modelValue', isChecked)
      return
    }

    const values = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = values.indexOf(props.value as string | number)

    if (isChecked && index === -1 && props.value !== undefined) values.push(props.value)
    if (!isChecked && index !== -1) values.splice(index, 1)

    emit('update:modelValue', values)
  },
})

const onChange = (event: Event) => {
  checked.value = (event.target as HTMLInputElement).checked
}
</script>

<template>
  <label
    :class="
      cn(
        'inline-flex cursor-pointer items-start gap-2',
        { 'cursor-not-allowed opacity-60': disabled },
        props.class,
      )
    "
  >
    <input
      type="checkbox"
      class="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="select-none">
      <span class="block text-sm">{{ label }}</span>
      <span v-if="description" class="block text-[11px] text-slate-400">{{ description }}</span>
    </span>
  </label>
</template>