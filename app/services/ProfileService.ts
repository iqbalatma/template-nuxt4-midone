import { useAuthStore } from '~/stores/auth'
import { useFlashStore } from '~/stores/flash'
import type { Profile } from '~/types/entities/user'
import type { ResponseData, ResponseSingleData } from '~/types/response'

/**
 * Mirrors `user.UpdateProfileRequest` in Go - no roles and no password. The
 * user may edit its own details but not its own access; roles go through
 * /api/management/users, the password through updatePassword below.
 */
export interface ProfileRequest {
  first_name: string
  last_name: string | null
  email: string
  phone_number: string | null
}

/** Mirrors `user.UpdatePasswordRequest`. */
export interface UpdatePasswordRequest {
  current_password: string
  password: string
  password_confirm: string
}

export const useProfileService = () => {
  const { $api } = useNuxtApp()
  const { setUser } = useAuthStore()
  const flashStore = useFlashStore()
  const submitting = ref(false)

  /**
   * Optional fields are left out of the form data rather than sent blank: the
   * Go side binds a missing field to nil and writes NULL, which is how a phone
   * number gets cleared. An empty string would store an empty string instead.
   */
  const toFormData = (request: ProfileRequest, avatar: File): FormData => {
    const form = new FormData()
    for (const [key, value] of Object.entries(request)) {
      if (value !== null) form.append(key, value)
    }
    form.append('avatar', avatar)
    return form
  }

  /**
   * `avatar` is optional and the endpoint is the same either way: PATCH /api/me
   * binds JSON or multipart depending on the content type, and leaves the
   * existing avatar alone when no file is attached. Sending multipart always
   * would work too, but it would also mean every save carries a file boundary
   * for a form that usually has no file in it.
   */
  const update = async (request: ProfileRequest, avatar?: File | null): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseSingleData<Profile>>('api/me', {
        method: 'PATCH',
        body: avatar ? toFormData(request, avatar) : request,
      })
      // The header and the menu read the store, not this page. The response is
      // the same ProfileResource /api/me returns, permissions included, so this
      // cannot blank the menu the way a thinner shape would.
      await setUser(response.payload.data)
      flashStore.setSuccess(response)
      return true
    } catch {
      // the $api plugin already pushed the error into the flash store
      return false
    } finally {
      submitting.value = false
    }
  }

  /**
   * A wrong current password comes back as a per-field error on
   * `current_password`, not as ERR_AUTHENTICATION: the API answers that way on
   * purpose, because a 401 here would trip forceLogout and throw the user out
   * over a typo. A Google-only account has no password to compare against and
   * is pointed at the forgot-password flow instead.
   */
  const updatePassword = async (request: UpdatePasswordRequest): Promise<boolean> => {
    submitting.value = true
    try {
      const response = await $api<ResponseData>('api/me/password', {
        method: 'PATCH',
        body: request,
      })
      flashStore.setSuccess(response)
      return true
    } catch {
      return false
    } finally {
      submitting.value = false
    }
  }

  return { update, updatePassword, submitting }
}
