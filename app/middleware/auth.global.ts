export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Avoid redirect loop: skip if already on the login page
  if (!authStore.isAuthenticated && to.path !== "/auth/login") {
    return navigateTo("/auth/login");
  }

  // Optionally, prevent logged-in users from visiting the login page
  if (authStore.isAuthenticated && to.path === "/auth/login") {
    return navigateTo("/");
  }
});
