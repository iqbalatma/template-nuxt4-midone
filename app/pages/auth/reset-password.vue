<script lang="ts" setup>
import { Lucide } from '~/base/ui/lucide'
import { Button } from '~/base/ui/button'
import { Input } from '~/base/ui/input'
import { useAuthService } from '~/services/AuthService'
import FormFeedback from '~/components/FormFeedback.vue'
import SimpleAlert from '~/components/SimpleAlert.vue'

definePageMeta({
  layout: 'auth',
  public: true,
})

const route = useRoute()
const flashStore = useFlashStore()
const { resetPassword, submitting } = useAuthService()

// The token arrives in the emailed link, never typed by hand.
const token = computed(() => (route.query['token'] as string) ?? '')

const form = ref({ password: '', password_confirm: '' })

// Checked here as well as server-side purely so the user finds out before the
// round trip; the API validates it regardless.
const mismatch = computed(
  () => form.value.password_confirm !== '' && form.value.password !== form.value.password_confirm,
)

const submit = async () => {
  if (mismatch.value) return
  await resetPassword({
    token: token.value,
    password: form.value.password,
    password_confirm: form.value.password_confirm,
  })
}
</script>

<template>
  <form @submit.prevent="submit()">
    <h1 class="text-2xl font-semibold">Choose a new password</h1>
    <p class="mt-1 text-sm opacity-50">Pick something you have not used here before.</p>

    <div class="mt-8 flex flex-col gap-2">
      <SimpleAlert />

      <!-- Reaching this page without a token means the link was mangled;
           no form is worth showing. -->
      <div
        v-if="!token"
        class="flex items-start gap-3 rounded-lg border border-danger/30 p-4 text-sm"
      >
        <Lucide icon="TriangleAlert" class="text-danger mt-0.5 size-5 shrink-0" />
        <p class="opacity-70">
          This reset link is missing its token. Request a new one from the
          <NuxtLink class="text-primary" to="/auth/forgot-password">forgot password</NuxtLink>
          page.
        </p>
      </div>

      <template v-else>
        <Input
          :class="
            cn('block w-full rounded-lg px-4 py-6', {
              'border-danger': flashStore.isKeyErrors('password'),
            })
          "
          type="password"
          autocomplete="new-password"
          v-model="form.password"
          placeholder="New password"
        />
        <FormFeedback feedbackKey="password" />

        <Input
          :class="cn('mt-2 block w-full rounded-lg px-4 py-6', { 'border-danger': mismatch })"
          type="password"
          autocomplete="new-password"
          v-model="form.password_confirm"
          placeholder="Confirm new password"
        />
        <p v-if="mismatch" class="text-danger text-sm">Both passwords must match.</p>
        <FormFeedback feedbackKey="password_confirm" />
      </template>
    </div>

    <div class="mt-8 flex flex-col gap-3">
      <Button
        v-if="token"
        class="w-full rounded-lg px-4 py-5"
        variant="primary"
        type="submit"
        :disabled="submitting || mismatch"
      >
        {{ submitting ? 'Saving…' : 'Reset password' }}
        <Lucide icon="ArrowRight" class="size-4" />
      </Button>

      <NuxtLink class="flex items-center justify-center gap-2 text-sm opacity-70 hover:opacity-100" to="/auth">
        <Lucide icon="ArrowLeft" class="size-4" />
        Back to sign in
      </NuxtLink>
    </div>
  </form>
</template>
