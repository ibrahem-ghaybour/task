/**
 * Authentication Store
 * Global state management for user authentication using Pinia
 * Handles login, register, logout, and user session management
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FetchOptions } from "ofetch";
import type { User, LoginPayload, RegisterPayload, AuthResponse, MeResponse } from "~/types/auth";

export const useAuthStore = defineStore("auth", () => {
  const { $api } = useNuxtApp();
  
  // ========== State ==========
  
  /** Access token stored in cookie (15min expiry) */
  const accessToken = useCookie<string | null>("access_token", {
    default: () => null,
    maxAge: 60 * 15, // 15 minutes
    sameSite: "lax",
  });
  
  /** Current authenticated user data */
  const currentUser = ref<User | null>(null);
  
  /** Loading state for async operations */
  const loading = ref(false);
  /**
   * Fetch current user data from API
   * @returns Promise with user data or null
   */
  const fetchMe = async () => {
    if (!accessToken.value) {
      currentUser.value = null;
      return null;
    }
    const response = await $api<MeResponse>("/auth/me", {
      method: "GET",
    } as FetchOptions<"json", any>);
    currentUser.value = response.data.user;
    return response.data.user;
  };

  /** Computed property to check if user is authenticated */
  const isAuthenticated = computed(() => !!accessToken.value);
  
  /**
   * Initialize user on mount if token exists
   * Automatically fetches user data on client-side mount
   */
  if (import.meta.client) {
    onMounted(() => {
      if (!currentUser.value && accessToken.value) {
        fetchMe().catch(() => {
          // Silently fail if token is invalid
          accessToken.value = null;
        });
      }
    });
  }
  
  /**
   * Set access token in cookie
   * @param token - JWT access token or null to clear
   */
  const setAccessToken = (token: string | null) => {
    accessToken.value = token;
  };

  // ========== Actions ==========
  
  /**
   * Login user with credentials
   * @param payload - Login credentials (username, password, provider, otp)
   * @returns Promise with auth response
   */
  const login = async (payload: LoginPayload) => {
    loading.value = true;
    try {
      const res = await $api<AuthResponse>("/login", {
        method: "POST",
        body: payload,
      } as FetchOptions<"json", any>);

      console.log("Login successful:", res.message);
      setAccessToken(res.data.access_token);
      
      // Fetch user data after successful login
      await fetchMe();
      
      return res;
    } catch (err) {
      throw err;
    } finally {
      loading.value = false;
    }
  };
  /**
   * Register new user
   * @param payload - Registration data (name, email, password)
   * @returns Promise with auth response
   */
  const register = async (payload: RegisterPayload) => {
    loading.value = true;
    try {
      const res = await $api<AuthResponse>("/auth/register", {
        method: "POST",
        body: payload,
      } as FetchOptions<"json", any>);

      console.log("Register successful:", res.message);
      setAccessToken(res.data.access_token);
      
      // Fetch user data after successful registration
      await fetchMe();
      
      return res;
    } catch (err) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Logout user and clear session
   * Notifies server and clears local state
   */
  const logout = async () => {
    try {
      // Notify server to clear refresh token cookie
      await $api("/auth/logout", {
        method: "POST",
      } as FetchOptions);
    } catch {
      // تجاهل الخطأ، سننظف الحالة محليًا على أي حال
    } finally {
      setAccessToken(null);
      currentUser.value = null;
    }
  };

  return {
    // state
    accessToken,
    currentUser,
    loading,

    // getters
    isAuthenticated,

    // actions
    setAccessToken,
    login,
    register,
    logout,
    fetchMe,
  };
});