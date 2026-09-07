<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { Box } from '~/base/ui/box'
import { Badge } from '~/base/ui/badge'
import { Button } from '~/base/ui/button'
import { Input } from '~/base/ui/input'
import { Label } from '~/base/ui/label'
import { Lucide } from '~/base/ui/lucide'
import { useAuthUser } from '~/composables/useAuthUser'
import { type ProfileRequest, useProfileService } from '~/services/ProfileService'

definePageMeta({
  title: 'profile.detail.title',
  pageSubTitle: 'profile.detail.subtitle',
})

const { user, initials, roleNames, avatarUrl } = useAuthUser()
const { update, submitting } = useProfileService()
const flashStore = useFlashStore()

/** Optional fields are kept as strings for the inputs, then sent as null when blank */
const form = ref({ first_name: '', last_name: '', email: '', phone_number: '' })

// The store is filled from localStorage before fetchMe resolves, so seed from
// whatever is there and re-seed when the fresh copy lands.
const seed = () => {
  form.value = {
    first_name: user.value?.first_name ?? '',
    last_name: user.value?.last_name ?? '',
    email: user.value?.email ?? '',
    phone_number: user.value?.phone_number ?? '',
  }
}
watch(user, seed, { immediate: true })

// Roles are shown but not editable, on purpose: a user editing its own details
// must not be able to hand itself a role. The API ignores them here too.

// The avatar rides along with the rest of the form rather than uploading on
// pick: one PATCH, and nothing is written until Save - a picked file that is
// never saved leaves the stored avatar alone.
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const previewUrl = ref('')

const setAvatar = (file: File | null) => {
  // Object URLs are held by the document until revoked, so the old one goes
  // before the new one is made.
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  avatarFile.value = file
  previewUrl.value = file ? URL.createObjectURL(file) : ''
  // Clearing the input as well, or picking the same file again fires no change.
  if (!file && avatarInput.value) avatarInput.value.value = ''
}

const onPickAvatar = (event: Event) =>
  setAvatar((event.target as HTMLInputElement).files?.[0] ?? null)

onUnmounted(() => setAvatar(null))

const toRequest = (): ProfileRequest => ({
  first_name: form.value.first_name.trim(),
  last_name: form.value.last_name.trim() || null,
  email: form.value.email.trim(),
  phone_number: form.value.phone_number.trim() || null,
})

const onSubmit = async () => {
  flashStore.clearMessages()
  // The response carries the stored avatar, so the preview is dropped on
  // success and what shows from then on is what the API actually kept.
  if (await update(toRequest(), avatarFile.value)) setAvatar(null)
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <Box class="col-span-12 p-5">
      <div class="flex items-center gap-4 border-b border-foreground/5 pb-5">
        <img
          v-if="previewUrl || avatarUrl"
          :src="previewUrl || avatarUrl"
          alt=""
          class="size-14 flex-none rounded-full object-cover"
        />
        <div
          v-else
          class="bg-primary/10 text-primary flex size-14 flex-none items-center justify-center rounded-full text-lg font-medium"
        >
          {{ initials }}
        </div>
        <div class="min-w-0">
          <div class="truncate font-medium">{{ user?.email }}</div>
          <div class="mt-1 flex flex-wrap gap-1">
            <Badge v-for="role in roleNames" :key="role" look="outline" variant="primary">
              {{ role }}
            </Badge>
            <span v-if="!roleNames.length" class="text-xs opacity-60">{{
              $t('profile.detail.noRole')
            }}</span>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <input
              ref="avatarInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="file:bg-primary/10 file:text-primary max-w-full text-xs file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-medium"
              @change="onPickAvatar"
            />
            <button
              v-if="avatarFile"
              type="button"
              class="text-foreground/50 hover:text-foreground cursor-pointer"
              :title="$t('common.cancel')"
              @click="setAvatar(null)"
            >
              <Lucide icon="X" class="size-4" />
            </button>
          </div>
          <!-- A rejected file (too big, wrong type) comes back as a message,
               not a field error: the media layer answers ERR_INVALID_ACTION,
               which the $api plugin already pushed into the flash store. -->
          <SmallInfo>{{ $t('profile.detail.avatarHint') }}</SmallInfo>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6">
          <Label for="profile-first-name"
            >{{ $t('account.users.form.firstName') }}<RequiredMark
          /></Label>
          <Input
            id="profile-first-name"
            v-model="form.first_name"
            :aria-invalid="flashStore.isKeyErrors('first_name')"
            class="mt-2"
            :placeholder="$t('profile.detail.firstNamePlaceholder')"
          />
          <FormFeedback feedbackKey="first_name" />
        </div>

        <div class="col-span-12 md:col-span-6">
          <Label for="profile-last-name">{{ $t('account.users.form.lastName') }}</Label>
          <Input
            id="profile-last-name"
            v-model="form.last_name"
            :aria-invalid="flashStore.isKeyErrors('last_name')"
            class="mt-2"
            :placeholder="$t('account.users.form.optional')"
          />
          <FormFeedback feedbackKey="last_name" />
        </div>

        <div class="col-span-12 md:col-span-6">
          <Label for="profile-email">{{ $t('common.email') }}<RequiredMark /></Label>
          <Input
            id="profile-email"
            v-model="form.email"
            :aria-invalid="flashStore.isKeyErrors('email')"
            type="email"
            class="mt-2"
            :placeholder="$t('profile.detail.emailPlaceholder')"
          />
          <FormFeedback feedbackKey="email" />
        </div>

        <div class="col-span-12 md:col-span-6">
          <Label for="profile-phone">{{ $t('account.users.form.phone') }}</Label>
          <Input
            id="profile-phone"
            v-model="form.phone_number"
            :aria-invalid="flashStore.isKeyErrors('phone_number')"
            class="mt-2"
            :placeholder="$t('account.users.form.optional')"
          />
          <FormFeedback feedbackKey="phone_number" />
        </div>
      </div>

      <div class="mt-7 flex justify-end">
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
