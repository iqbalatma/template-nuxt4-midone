<script setup lang="ts">
import { Chart, getColor } from '~/base/ui/chart'
import { useDarkMode } from '~/composables/useDarkMode'
import type { JobTrendPoint } from '~/types/entities/job_log'

const props = defineProps<{ points: JobTrendPoint[] }>()

const { isDark } = useDarkMode()

/**
 * The base Chart component builds its chart once on mount and does not watch
 * its config, so the canvas is remounted whenever the data or the theme
 * changes. Cheap for a chart this size, and it keeps the theme colours right —
 * getColor reads CSS custom properties at construction time, so a chart built
 * in light mode keeps light-mode colours after a toggle otherwise.
 */
const chartKey = computed(
  () => `${props.points.length}:${props.points.at(-1)?.bucket ?? ''}:${isDark.value}`,
)

// Only the hour/day part of the bucket label. The API sends the full
// "YYYY-MM-DD HH:00" so the value stays unambiguous on the wire; 24 axis
// labels each repeating the same date is unreadable.
const labels = computed(() =>
  props.points.map((point) => {
    const [date, time] = point.bucket.split(' ')
    return time ? time.slice(0, 5) : (date ?? '').slice(5)
  }),
)

const stacked = { stacked: true }
</script>

<template>
  <!-- A fixed height: the canvas has no intrinsic size, and maintainAspectRatio
       is off so it would otherwise collapse to nothing inside a grid cell. -->
  <div class="h-[260px]">
    <Chart
      :key="chartKey"
      :config="{
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: $t('system.jobs.legendSuccess'),
              data: props.points.map((point) => point.success),
              backgroundColor: getColor('--color-success', 0.75),
              borderRadius: 2,
            },
            {
              label: $t('system.jobs.legendFailed'),
              data: props.points.map((point) => point.failed),
              backgroundColor: getColor('--color-danger', 0.85),
              borderRadius: 2,
            },
            {
              label: $t('system.jobs.legendSkipped'),
              data: props.points.map((point) => point.skipped),
              backgroundColor: getColor('--color-warning', 0.8),
              borderRadius: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: (items) => props.points[items[0]?.dataIndex ?? 0]?.bucket ?? '',
              },
            },
          },
          scales: {
            x: {
              ...stacked,
              grid: { display: false },
              ticks: {
                color: getColor('--color-foreground', 0.5),
                maxRotation: 0,
                autoSkipPadding: 16,
              },
            },
            y: {
              ...stacked,
              beginAtZero: true,
              // Whole runs only — a y-axis offering 0.5 of a job run is noise.
              ticks: { color: getColor('--color-foreground', 0.5), precision: 0 },
              grid: { color: getColor('--color-foreground', 0.08) },
              border: { display: false },
            },
          },
        },
      }"
    />
  </div>
</template>
