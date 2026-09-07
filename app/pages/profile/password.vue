<script setup lang="ts">
import { ref } from 'vue'
import { Box } from '~/base/ui/box'
import { Button } from '~/base/ui/button'
import { Input } from '~/base/ui/input'
import { Label } from '~/base/ui/label'
import { Lucide } from '~/base/ui/lucide'
import { useProfileService } from '~/services/ProfileService'

definePageMeta({
  title: 'profile.password.title',
  pageSubTitle: 'profile.password.subtitle',
})

const { updatePassword, submitting } = useProfileService()
const flashStore = useFlashStore()

const getInitialForm = () => ({ current_password: '', password: '', password_confirm: '' })
const form = ref(getInitialForm())

const onSubmit = async () => {
  flashStore.clearMessages()
  // Only clear the fields on success: a rejected attempt leaves the new
  // password in place so the user only has to fix what was actually wrong.
  if (await updatePassword(form.value)) form.value = getInitialForm()
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 p-5">
      <p class="text-sm opacity-70">{{ $t('profile.password.notice') }}</p>

      <div class="mt-6 grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6">
          <Label for="current-password">{{ $t('profile.password.current') }}<RequiredMark /></Label>
          <Input
            id="current-password"
            v-model="form.current_password"
            :aria-invalid="flashStore.isKeyErrors('current_password')"
            type="password"
            autocomplete="current-password"
            class="mt-2"
            :placeholder="$t('profile.password.currentPlaceholder')"
          />
          <FormFeedback feedbackKey="current_password" />
        </div>

        <div class="col-span-12 md:col-span-6"></div>

        <div class="col-span-12 md:col-span-6">
          <Label for="new-password">{{ $t('profile.password.new') }}<RequiredMark /></Label>
          <Input
            id="new-password"
            v-model="form.password"
            :aria-invalid="flashStore.isKeyErrors('password')"
            type="password"
            autocomplete="new-password"
            class="mt-2"
            :placeholder="$t('profile.password.newPlaceholder')"
          />
          <FormFeedback feedbackKey="password" />
        </div>

        <div class="col-span-12 md:col-span-6">
          <Label for="confirm-password">{{ $t('profile.password.confirm') }}<RequiredMark /></Label>
          <Input
            id="confirm-password"
            v-model="form.password_confirm"
            :aria-invalid="flashStore.isKeyErrors('password_confirm')"
            type="password"
            autocomplete="new-password"
            class="mt-2"
            :placeholder="$t('profile.password.confirmPlaceholder')"
          />
          <FormFeedback feedbackKey="password_confirm" />
        </div>
      </div>

      <div class="mt-7 flex items-center justify-between gap-3">
        <SmallInfo>
          {{ $t('profile.password.oauthHint') }}
          <NuxtLink to="/auth/forgot-password" class="text-primary">
            {{ $t('profile.password.oauthLink') }}
          </NuxtLink>
        </SmallInfo>
        <Button variant="primary" :disabled="submitting" @click="onSubmit">
          <Lucide
            :icon="submitting ? 'LoaderCircle' : 'Save'"
            :class="{ 'animate-spin': submitting }"
          />
          {{ submitting ? $t('common.saving') : $t('common.save') }}
        </Button>
      </div>
    </Box>
  </div>
</template>
