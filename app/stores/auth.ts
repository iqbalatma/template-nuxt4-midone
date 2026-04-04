import type User from "~/types/entities/user";

export const useAuthStore = defineStore("authStore", () => {
    const user = ref<User | null>(null)
    const accessToken = useCookie('access_token', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: false,
        watch: true
    })
    const setAuthenticatedUser = async (responseUser: User): Promise<void> => {
        user.value = responseUser
        accessToken.value = responseUser.access_token
    }

    const setUnauthenticatedUser = async ()=>{
      useCookie("access_token").value = null
      user.value = null
    }



    return {
      user,
      accessToken,
      setAuthenticatedUser,
      setUnauthenticatedUser,
    }
})
