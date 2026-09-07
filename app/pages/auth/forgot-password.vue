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

const flashStore = useFlashStore()
const { forgotPassword, submitting } = useAuthService()

const email = ref('')
// The API answers identically whether or not the address exists, so this page
// must too — anything else would put back the account enumeration the API
// deliberately avoids.
const sent = ref(false)

const submit = async () => {
  if (await forgotPassword({ email: email.value })) sent.value = true
}
</script>

<template>
  <form @submit.prevent="submit()">
    <h1 class="text-2xl font-semibold">Forgot password</h1>
    <p class="mt-1 text-sm opacity-50">
      Enter the email address on your account and we will send you a link to choose a new password.
    </p>

    <div class="mt-8 flex flex-col gap-2">
      <SimpleAlert />

      <template v-if="!sent">
        <Input
          :class="
            cn('block w-full rounded-lg px-4 py-6', {
              'border-danger': flashStore.isKeyErrors('email'),
            })
          "
          type="email"
          autocomplete="email"
          v-model="email"
          placeholder="Email"
        />
        <FormFeedback feedbackKey="email" />
      </template>

      <div v-else class="flex items-start gap-3 rounded-lg border border-foreground/10 p-4">
        <Lucide icon="MailCheck" class="mt-0.5 size-5 shrink-0 text-primary" />
        <p class="text-sm opacity-70">
          If that address belongs to an account, a reset link is on its way. The link expires
          shortly — check the spam folder if it does not arrive.
        </p>
      </div>
    </div>

    <div class="mt-8 flex flex-col gap-3">
      <Button
        v-if="!sent"
        class="w-full rounded-lg px-4 py-5"
        variant="primary"
        type="submit"
        :disabled="submitting"
      >
        {{ submitting ? 'Sending…' : 'Send reset link' }}
        <Lucide icon="ArrowRight" class="size-4" />
      </Button>

      <NuxtLink class="flex items-center justify-center gap-2 text-sm opacity-70 hover:opacity-100" to="/auth">
        <Lucide icon="ArrowLeft" class="size-4" />
        Back to sign in
      </NuxtLink>
    </div>
  </form>
</template>
