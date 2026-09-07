<script lang="ts" setup>
import { Lucide } from '~/base/ui/lucide'
import { Button } from '~/base/ui/button'
import { CheckboxRoot, CheckboxControl, CheckboxLabel } from '~/base/ui/checkbox'
import { Input } from '~/base/ui/input'
import googleLogoUrl from '~/assets/images/google.svg'
import { type AuthRequest, useAuthService } from '~/services/AuthService'
import FormFeedback from '~/components/FormFeedback.vue'
import SimpleAlert from '~/components/SimpleAlert.vue'

definePageMeta({
  layout: 'auth',
  public: true,
})

const formRequest = ref<AuthRequest>({
  email: '',
  password: '',
})
const flashStore = useFlashStore()

const { authenticate, loginWithGoogle, submitting } = useAuthService()
</script>

<template>
  <form @submit.prevent="authenticate(formRequest)">
    <h1 class="text-2xl font-semibold">Sign In</h1>
    <p class="mt-1 text-sm opacity-50">Enter your credentials to continue.</p>

    <div class="mt-8 flex flex-col gap-2">
      <SimpleAlert />

      <Input
        :class="
          cn('block w-full rounded-lg px-4 py-6', {
            'border-danger': flashStore.isKeyErrors('email'),
          })
        "
        type="email"
        autocomplete="email"
        v-model="formRequest.email"
        placeholder="Email"
      />
      <FormFeedback feedbackKey="email" />

      <Input
        :class="
          cn('mt-2 block w-full rounded-lg px-4 py-6', {
            'border-danger': flashStore.isKeyErrors('password'),
          })
        "
        type="password"
        autocomplete="current-password"
        v-model="formRequest.password"
        placeholder="Password"
      />
      <FormFeedback feedbackKey="password" />

      <div class="mt-2 flex items-center text-xs sm:text-sm">
        <div class="mr-auto flex-row items-center">
          <CheckboxRoot>
            <CheckboxControl />
            <CheckboxLabel>Remember me</CheckboxLabel>
          </CheckboxRoot>
        </div>
        <NuxtLink class="opacity-70 hover:opacity-100" to="/auth/forgot-password">
          Forgot Password?
        </NuxtLink>
      </div>
    </div>

    <div class="mt-8 flex flex-col gap-3">
      <Button
        class="w-full rounded-lg px-4 py-5"
        variant="primary"
        type="submit"
        :disabled="submitting"
      >
        {{ submitting ? 'Signing in...' : 'Login' }}
        <Lucide icon="ArrowRight" class="size-4" />
      </Button>

      <div class="relative flex items-center justify-center py-1">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-foreground/10"></div>
        </div>
        <span class="relative bg-background px-3 text-xs uppercase tracking-wide opacity-40">
          or
        </span>
      </div>

      <Button
        class="w-full rounded-lg px-4 py-5"
        look="outline"
        type="button"
        @click="loginWithGoogle()"
      >
        <img class="h-4 w-4" :src="googleLogoUrl" alt="" />
        Sign in with Google
      </Button>
    </div>

    <p class="mt-10 text-xs opacity-50">
      By signing in, you agree to our
      <NuxtLink class="text-primary" to="/terms-and-conditions">{{ $t('terms.title') }}</NuxtLink>
      &amp;
      <NuxtLink class="text-primary" to="/privacy-policy">{{ $t('privacyPolicy.title') }}</NuxtLink>
    </p>
  </form>
</template>
