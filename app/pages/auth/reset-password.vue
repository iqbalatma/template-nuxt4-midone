<script lang="ts" setup>
import { Box } from '~/base/ui/box'
import { Button } from '~/base/ui/button'
import { Input } from '~/base/ui/input'
import logoUrl from '~/assets/images/logo.svg'
import { useAuthService } from '~/services/AuthService'
import FormFeedback from '~/components/FormFeedback.vue'
import SimpleAlert from '~/components/SimpleAlert.vue'
import { cn } from '~/utils/cn'

definePageMeta({
  layout: false,
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
  <div class="bg-primary bg-noise relative h-screen">
    <div class="container relative z-10 mx-auto flex h-full items-center justify-center px-5">
      <Box class="w-full max-w-md px-5 py-8 sm:px-8">
        <a class="mb-6 flex items-center" href="/auth">
          <img class="w-6" :src="logoUrl" alt="" />
          <span class="ml-3 text-xl font-medium">
            Midone <span class="font-light opacity-70">Admin</span>
          </span>
        </a>

        <h2 class="text-2xl font-semibold">Choose a new password</h2>

        <div class="mt-6 flex flex-col gap-2">
          <SimpleAlert />

          <!-- Reaching this page without a token means the link was mangled;
               no form is worth showing. -->
          <p v-if="!token" class="text-danger">
            This reset link is missing its token. Request a new one from the
            <NuxtLink class="text-primary" to="/auth/forgot-password">forgot password</NuxtLink>
            page.
          </p>

          <template v-else>
            <Input
              :class="
                cn('box block min-w-full px-5 py-6', {
                  'border-danger': flashStore.isKeyErrors('password'),
                })
              "
              v-model="form.password"
              type="password"
              placeholder="New password"
            />
            <FormFeedback feedbackKey="password" />

            <Input
              :class="
                cn('box mt-2 block min-w-full px-5 py-6', { 'border-danger': mismatch })
              "
              v-model="form.password_confirm"
              type="password"
              placeholder="Confirm new password"
              @keyup.enter="submit()"
            />
            <p v-if="mismatch" class="text-danger text-sm">Both passwords must match.</p>
            <FormFeedback feedbackKey="password_confirm" />
          </template>
        </div>

        <div class="mt-6 flex flex-col gap-3">
          <Button
            v-if="token"
            class="box w-full px-4 py-5"
            variant="primary"
            :disabled="submitting || mismatch"
            @click="submit()"
          >
            {{ submitting ? 'Saving…' : 'Reset password' }}
          </Button>
          <NuxtLink class="text-primary text-center" to="/auth">Back to sign in</NuxtLink>
        </div>
      </Box>
    </div>
  </div>
</template>
