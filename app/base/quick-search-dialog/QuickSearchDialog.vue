<script setup lang="ts">
import { debounce } from 'lodash'
import { Lucide } from '@/base/ui/lucide'
import { Input } from '@/base/ui/input'
import { DialogRoot, DialogContent } from '@/base/ui/dialog'
import { useSearchablePages } from '~/composables/useQuickSearch'
import { useUserService } from '~/services/UserService'
import { useAuthStore } from '~/stores/auth'
import { Permission } from '~/enums/Permission'

const { open } = defineProps<{
  open?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { t } = useI18n()
const query = ref('')

// Input renders a bare <input> as its root, so $el is that element.
const inputRef = ref<{ $el: HTMLInputElement } | null>(null)

const { search: searchPages } = useSearchablePages()
const matchedPages = computed(() => searchPages(query.value))

// Users come from the list endpoint, which already carries the user.index gate.
// Asking for them without it would 403 the request and flash an error over the
// dialog, so the section is only fetched — and only rendered — when the user
// may see it.
const { hasPermission } = useAuthStore()
const canSearchUsers = hasPermission(Permission.UserIndex)
const { getAllPaginated: getUsers, usersCollection } = useUserService()
const users = computed(() => (canSearchUsers ? usersCollection.value.data : []))

const fullName = (user: { first_name: string; last_name: string | null }) =>
  [user.first_name, user.last_name].filter(Boolean).join(' ')

const runSearch = debounce((search: string) => {
  if (canSearchUsers) getUsers({ page: 1, per_page: 5, search })
}, 300)

watch(query, (value) => {
  const trimmed = value.trim()
  if (trimmed) runSearch(trimmed)
})

// The dialog instance is reused across opens (v-model:open toggles the same
// one), which is what both halves of this watcher are for: nothing remounts, so
// closing has to clear the state, and opening has to move the caret into the
// box by hand — `autofocus` only fires on mount, so it worked on the very first
// open and never again.
//
// After `nextTick`, because the content carries `hidden` until Vue has patched
// the DOM and a hidden element cannot take focus. Deliberately not a
// `requestAnimationFrame`: that never fires in a background tab, which is
// exactly where a restored session opens the dialog.
watch(
  () => open,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      inputRef.value?.$el?.focus()
      return
    }
    runSearch.cancel()
    query.value = ''
    usersCollection.value.data = []
  },
)

const hasResults = computed(() => matchedPages.value.length > 0 || users.value.length > 0)

const goTo = async (path: string) => {
  emit('update:open', false)
  await navigateTo(path)
}
</script>

<template>
  <DialogRoot :open="open" @openChange="(details) => emit('update:open', details.open)">
    <DialogContent class="p-0 sm:max-w-2xl">
      <div class="border-foreground/15 relative border-b border-dashed">
        <Lucide class="z-50 absolute inset-y-0 my-auto ml-4 opacity-70" icon="Search" />
        <Input
          ref="inputRef"
          v-model="query"
          class="h-14 w-full border-none bg-transparent pl-12 pr-19 shadow-none focus:ring-offset-transparent focus-visible:ring-transparent"
          type="text"
          :placeholder="$t('quickSearch.placeholder')"
        />
        <div
          class="border-foreground/30 absolute inset-y-0 right-0 my-auto mr-4 flex h-6 items-center rounded-lg border px-2 text-xs opacity-70"
        >
          esc
        </div>
      </div>

      <div v-if="!query.trim()" class="px-5 py-8 text-center text-sm opacity-60">
        {{ $t('quickSearch.hint') }}
      </div>

      <div v-else-if="!hasResults" class="px-5 py-8 text-center text-sm opacity-60">
        {{ $t('quickSearch.empty', { query: query.trim() }) }}
      </div>

      <template v-else>
        <div v-if="matchedPages.length" class="px-5 py-4">
          <div class="text-xs uppercase opacity-70">{{ $t('quickSearch.pages') }}</div>
          <div class="mt-3.5 flex flex-col gap-1">
            <a
              v-for="page in matchedPages"
              :key="page.path"
              class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex cursor-pointer items-center gap-2.5 rounded-xl border border-transparent p-1"
              href=""
              @click.prevent="goTo(page.path)"
            >
              <div
                class="border-primary/10 bg-primary/10 text-primary flex size-8 items-center justify-center overflow-hidden rounded-lg border"
              >
                <Lucide v-if="page.icon" class="stroke-1" :icon="page.icon" />
              </div>
              <div class="truncate text-sm font-medium">{{ t(page.title) }}</div>
            </a>
          </div>
        </div>

        <div v-if="users.length" class="border-foreground/15 border-t border-dashed px-5 py-4 pb-6">
          <div class="flex items-center">
            <div class="text-xs uppercase opacity-70">{{ $t('quickSearch.users') }}</div>
            <a
              class="ml-auto cursor-pointer text-xs opacity-70"
              href=""
              @click.prevent="goTo('/account/users')"
            >
              {{ $t('quickSearch.seeAll') }}
            </a>
          </div>
          <div class="mt-3.5 flex flex-col gap-1">
            <a
              v-for="user in users"
              :key="user.id"
              class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex cursor-pointer items-center gap-2.5 rounded-xl border border-transparent p-1"
              href=""
              @click.prevent="goTo(`/account/users?search=${encodeURIComponent(user.email)}`)"
            >
              <div
                class="border-primary/10 bg-primary/10 text-primary flex size-8 items-center justify-center overflow-hidden rounded-full border text-sm font-medium"
              >
                {{ (fullName(user) || user.email).charAt(0).toUpperCase() }}
              </div>
              <div class="truncate text-sm font-medium">{{ fullName(user) || user.email }}</div>
              <div class="hidden text-xs opacity-70 sm:block">{{ user.email }}</div>
            </a>
          </div>
        </div>
      </template>
    </DialogContent>
  </DialogRoot>
</template>
