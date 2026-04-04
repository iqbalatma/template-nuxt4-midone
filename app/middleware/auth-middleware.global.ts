export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie('access_token')

    const isPublic = to.meta.public === true
    if (!isPublic && !token.value){
        return navigateTo("/auth")
    }

    if (token.value && to.path === "/auth"){
        return navigateTo("/")
    }
})