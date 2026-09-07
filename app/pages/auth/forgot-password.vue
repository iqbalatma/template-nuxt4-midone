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
  <div class="bg-primary bg-noise relative h-screen">
    <div class="container relative z-10 mx-auto flex h-full items-center justify-center px-5">
      <Box class="w-full max-w-md px-5 py-8 sm:px-8">
        <a class="mb-6 flex items-center" href="/auth">
          <img class="w-6" :src="logoUrl" alt="" />
          <span class="ml-3 text-xl font-medium">
            Midone <span class="font-light opacity-70">Admin</span>
          </span>
        </a>

        <h2 class="text-2xl font-semibold">Forgot password</h2>
        <p class="mt-2 opacity-70">
          Enter the email address on your account and we will send you a link to choose a new
          password.
        </p>

        <div class="mt-6 flex flex-col gap-2">
          <SimpleAlert />

          <template v-if="!sent">
            <Input
              :class="
                cn('box block min-w-full px-5 py-6', {
                  'border-danger': flashStore.isKeyErrors('email'),
                })
              "
              v-model="email"
              type="email"
              placeholder="Email"
              @keyup.enter="submit()"
            />
            <FormFeedback feedbackKey="email" />
          </template>
        </div>

        <div class="mt-6 flex flex-col gap-3">
          <Button
            v-if="!sent"
            class="box w-full px-4 py-5"
            variant="primary"
            :disabled="submitting"
            @click="submit()"
          >
            {{ submitting ? 'Sending…' : 'Send reset link' }}
          </Button>
          <NuxtLink class="text-primary text-center" to="/auth">Back to sign in</NuxtLink>
        </div>
      </Box>
    </div>
  </div>
</template>
