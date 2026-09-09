<script lang="ts" setup>
import { Lucide } from '~/base/ui/lucide'
import logoUrl from '~/assets/images/logo.svg'

// Shared shell for every unauthenticated page (sign in, forgot password, reset
// password). The brand copy is deliberately generic - it sits next to three
// different forms, so anything sign-in specific would read wrong on two of them.
const features = [
  { icon: 'LayoutDashboard' as const, key: 'dashboard' },
  { icon: 'Workflow' as const, key: 'workflows' },
  { icon: 'ShieldCheck' as const, key: 'access' },
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
          {{ $t('auth.brand.heading') }}
        </h2>
        <p class="mt-3 max-w-sm text-white/50">
          {{ $t('auth.brand.subheading') }}
        </p>

        <div class="mt-10 flex flex-col gap-4">
          <div v-for="feature in features" :key="feature.key" class="flex items-start gap-3">
            <div
              class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10"
            >
              <Lucide :icon="feature.icon" class="size-4" />
            </div>
            <div>
              <div class="text-sm font-medium">
                {{ $t(`auth.brand.features.${feature.key}.title`) }}
              </div>
              <div class="text-sm text-white/40">
                {{ $t(`auth.brand.features.${feature.key}.description`) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="relative text-xs text-white/30">© {{ new Date().getFullYear() }} Midone</p>
    </div>
    <!-- END: Left brand panel -->

    <!-- BEGIN: Right form panel -->
    <!-- `light` pins this half to the light palette whatever the saved
         appearance is. It sits against a brand panel that is dark by design, so
         a dark form beside it loses the split the layout is built on - and the
         `text-foreground` is not redundant: colour inherits its *computed*
         value from <body>, so the palette has to be re-applied here to take. -->
    <div
      class="light relative flex w-full flex-col items-center justify-center bg-background px-6 py-16 text-foreground lg:w-1/2"
    >
      <!-- The switcher belongs to the shell, not the sign-in form: a reader who
           lands on forgot-password in the wrong language needs it just as much. -->
      <div class="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

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
