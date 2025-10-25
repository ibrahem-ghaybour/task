/**
 * Authentication Composable
 * Provides authentication-related functionality
 */
import { useAuthStore } from "~/stores/auth";
import type { LoginPayload } from "~/types/auth";

export const useAuth = () => {
  const authStore = useAuthStore();
  const toast = useToast();

  const login = async (payload: LoginPayload) => {
    try {
      await authStore.login(payload);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authStore.logout();
    } catch (error: any) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      await authStore.myProfile();
    } catch (error: any) {
      console.error("Profile refresh error:", error);
      throw error;
    }
  };

  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    
    // Actions
    login,
    logout,
    refreshProfile,
  };
};
