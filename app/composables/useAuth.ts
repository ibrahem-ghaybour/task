/**
 * Authentication Composable
 * Handles authentication operations with loading and error states
 */
import type { LoginPayload, RegisterPayload } from "~/types/auth";

export const useAuth = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Login user
   * @param credentials - Login credentials
   */
  const login = async (credentials: LoginPayload) => {
    loading.value = true;
    error.value = null;

    try {
      await authStore.login(credentials);
      return true;
    } catch (err: any) {
      error.value = err.message || "Login failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Register new user
   * @param userData - Registration data
   */
  const register = async (userData: RegisterPayload) => {
    loading.value = true;
    error.value = null;

    try {
      await authStore.register(userData);
      return true;
    } catch (err: any) {
      error.value = err.message || "Registration failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Logout user and redirect to login
   */
  const logout = async () => {
    loading.value = true;
    error.value = null;

    try {
      await authStore.logout();
      await router.push("/auth/login");
    } catch (err: any) {
      error.value = err.message || "Logout failed";
      // Still redirect even if API call fails
      await router.push("/auth/login");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch current user data
   */
  const fetchCurrentUser = async () => {
    loading.value = true;
    error.value = null;

    try {
      await authStore.fetchMe();
    } catch (err: any) {
      error.value = err.message || "Failed to fetch user data";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    currentUser: computed(() => authStore.currentUser),
    login,
    register,
    logout,
    fetchCurrentUser,
  };
};
