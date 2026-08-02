import type User from "~/types/entities/user";
import type { AuthProfile, AuthUser } from "~/types/entities/user";

export const useAuthStore = defineStore("authStore", () => {
    // Login/refresh yield an AuthProfile; /auth/me yields the fuller User
    const user = ref<User | AuthProfile | null>(null)
    const accessToken = useCookie('access_token', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: false,
        watch: true
    })

    const setAuthenticatedUser = async (authUser: AuthUser): Promise<void> => {
        const { tokens, ...profile } = authUser
        user.value = profile
        accessToken.value = tokens.access_token
    }

    const setUser = async (profile: User): Promise<void> => {
        user.value = profile
    }

    const setUnauthenticatedUser = async ()=>{
      useCookie("access_token").value = null
      user.value = null
    }


    return {
      user,
      accessToken,
      setAuthenticatedUser,
      setUser,
      setUnauthenticatedUser,
    }
})