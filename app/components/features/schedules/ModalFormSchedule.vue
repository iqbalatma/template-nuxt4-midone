<script setup lang="ts">
import { ref } from 'vue'
import { DialogCloseTrigger, DialogContent, DialogRoot, DialogTitle } from '~/base/ui/dialog'
import { Button } from '~/base/ui/button'
import { Label } from '~/base/ui/label'
import { Input } from '~/base/ui/input'
import { Lucide } from '~/base/ui/lucide'
import { useScheduleService } from '~/services/ScheduleService'
import type ScheduledJob from '~/types/entities/scheduled_job'

const emit = defineEmits<{ (e: 'submit'): void }>()

const { update, actingId } = useScheduleService()
const flashStore = useFlashStore()

const isShowModal = ref(false)
const editing = ref<ScheduledJob | null>(null)
const form = ref({ cron_expression: '', enabled: true })

/**
 * Examples rather than a cron builder UI: the expressions this app actually
 * needs are a handful of shapes, and someone editing a schedule can copy the
 * nearest one. A builder would be a lot of surface for a field that is edited
 * a few times a year.
 */
const examples = [
  { expression: '*/5 * * * *', key: 'everyFiveMinutes' },
  { expression: '0 * * * *', key: 'hourly' },
  { expression: '0 3 * * *', key: 'dailyAt3' },
  { expression: '0 0 * * 1', key: 'weeklyMonday' },
  { expression: '0 0 1 * *', key: 'monthly' },
] as const

// There is no create: a schedule row exists only because Go code registers the
// job, and a row without one would show a schedule that never fires.
const handleModal = (isShow: boolean, schedule?: ScheduledJob) => {
  isShowModal.value = isShow
  flashStore.clearMessages()

  if (!schedule) {
    editing.value = null
    return
  }

  editing.value = schedule
  form.value = { cron_expression: schedule.cron_expression, enabled: schedule.enabled }
}

const onSubmit = async () => {
  if (!editing.value) return

  // An invalid expression comes back as a per-field error rather than being
  // stored: the runner would otherwise skip that row on every tick and the job
  // would simply stop running, with nothing on this screen to say why.
  if (await update(editing.value.id, { ...form.value })) {
    handleModal(false)
    emit('submit')
  }
}

defineExpose({ handleModal })
</script>

<template>
  <DialogRoot
    :open="isShowModal"
    :onOpenChange="
      (details: { open: boolean }) => {
        isShowModal = details.open
      }
    "
  >
    <DialogContent class="sm:max-w-150">
      <DialogTitle>{{
        $t('system.schedules.form.title', { name: editing?.name ?? '' })
      }}</DialogTitle>

      <div class="mt-6 grid gap-4">
        <div>
          <Label for="schedule-cron">
            {{ $t('system.schedules.form.cron') }}<RequiredMark />
          </Label>
          <Input
            id="schedule-cron"
            v-model="form.cron_expression"
            :aria-invalid="flashStore.isKeyErrors('cron_expression')"
            class="mt-2 font-mono"
            placeholder="0 3 * * *"
          />
          <FormFeedback feedbackKey="cron_expression" />
          <SmallInfo>{{ $t('system.schedules.form.cronHint') }}</SmallInfo>
        </div>

        <div class="border-foreground/10 rounded-lg border p-3">
          <p class="mb-2 text-xs opacity-60">{{ $t('system.schedules.form.examples') }}</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="example in examples"
              :key="example.expression"
              type="button"
              class="border-foreground/10 hover:bg-foreground/5 rounded-md border px-2 py-1 text-left text-xs"
              @click="form.cron_expression = example.expression"
            >
              <span class="font-mono">{{ example.expression }}</span>
              <span class="ml-1.5 opacity-50">
                {{ $t(`system.schedules.form.example.${example.key}`) }}
              </span>
            </button>
          </div>
        </div>

        <CheckboxInput
          v-model="form.enabled"
          :label="$t('system.schedules.form.enabled')"
          :description="$t('system.schedules.form.enabledHint')"
        />
      </div>

      <div class="mt-7 flex justify-end gap-2">
        <DialogCloseTrigger as-child @click="handleModal(false)">
          <Button look="outline" variant="ghost">
            <Lucide icon="X" />
            {{ $t('common.cancel') }}
          </Button>
        </DialogCloseTrigger>
        <Button :disabled="actingId !== null" @click="onSubmit">
          <Lucide icon="Save" />
          {{ actingId !== null ? $t('common.saving') : $t('common.save') }}
        </Button>
      </div>
    </DialogContent>
  </DialogRoot>
</template>
