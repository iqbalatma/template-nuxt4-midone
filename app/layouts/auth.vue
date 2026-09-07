<script lang="ts" setup>
import { Lucide } from '~/base/ui/lucide'
import logoUrl from '~/assets/images/logo.svg'

// Shared shell for every unauthenticated page (sign in, forgot password, reset
// password). The brand copy is deliberately generic - it sits next to three
// different forms, so anything sign-in specific would read wrong on two of them.
const features = [
  {
    icon: 'LayoutDashboard' as const,
    title: 'One dashboard',
    description: 'Every metric that matters, on a single screen.',
  },
  {
    icon: 'Workflow' as const,
    title: 'Automated workflows',
    description: 'Background jobs and audits you can watch live.',
  },
  {
    icon: 'ShieldCheck' as const,
    title: 'Granular access',
    description: 'Roles and permissions enforced end to end.',
  },
]
</script>

<template>
  <div class="flex min-h-screen">
    <!-- BEGIN: Left brand panel -->
    <div
      class="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0a0a14] p-12 text-white lg:flex"
      style="
        background-image: radial-gradient(circle, rgb(255 255 255 / 0.06) 1px, transparent 1px);
        background-size: 22px 22px;
      "
    >
      <div
        class="pointer-events-none absolute -right-32 top-0 h-[32rem] w-[32rem] rounded-full bg-primary/50 blur-[120px]"
      ></div>
      <div
        class="pointer-events-none absolute -left-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-[120px]"
      ></div>

      <NuxtLink to="/" class="relative flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
          <img class="h-5 w-5" :src="logoUrl" alt="Midone Admin" />
        </div>
        <div class="leading-tight">
          <div class="text-sm font-semibold">Midone</div>
          <div class="text-[10px] uppercase tracking-widest text-white/40">Admin</div>
        </div>
      </NuxtLink>

      <div class="relative">
        <h2 class="text-4xl font-semibold leading-tight">
          Everything your team runs on, <br />
          in a single place.
        </h2>
        <p class="mt-3 max-w-sm text-white/50">
          Manage all your accounts, orders and reports in one place.
        </p>

        <div class="mt-10 flex flex-col gap-4">
          <div v-for="feature in features" :key="feature.title" class="flex items-start gap-3">
            <div
              class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10"
            >
              <Lucide :icon="feature.icon" class="size-4" />
            </div>
            <div>
              <div class="text-sm font-medium">{{ feature.title }}</div>
              <div class="text-sm text-white/40">{{ feature.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <p class="relative text-xs text-white/30">© {{ new Date().getFullYear() }} Midone</p>
    </div>
    <!-- END: Left brand panel -->

    <!-- BEGIN: Right form panel -->
    <div class="flex w-full flex-col items-center justify-center bg-background px-6 py-16 lg:w-1/2">
      <div class="w-full max-w-sm">
        <NuxtLink to="/" class="mb-10 flex items-center gap-2 lg:hidden">
          <img class="h-6 w-6" :src="logoUrl" alt="Midone Admin" />
          <span class="text-sm font-medium">
            Midone <span class="font-light opacity-60">Admin</span>
          </span>
        </NuxtLink>

        <slot />
      </div>
    </div>
    <!-- END: Right form panel -->
  </div>
</template>
