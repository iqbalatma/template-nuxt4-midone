import { computed } from 'vue'
import { useDarkModeStore } from '~/stores/dark-mode'

// Keeps the `dark` class on <html> in sync with the store. The store itself
// only persists the flag; nothing else watches it.
const applyDarkModeClass = (dark: boolean) => {
  document.querySelectorAll('html')[0]?.classList.toggle('dark', dark)
}

export const useDarkMode = () => {
  const darkModeStore = useDarkModeStore()

  const isDark = computed(() => darkModeStore.darkModeValue)

  const toggleDarkMode = () => {
    const next = !darkModeStore.darkModeValue
    darkModeStore.setDarkMode(next)
    applyDarkModeClass(next)
  }

  // Called on mount so a reload draws the persisted appearance.
  const syncDarkMode = () => applyDarkModeClass(darkModeStore.darkModeValue)

  return { isDark, toggleDarkMode, syncDarkMode }
}
