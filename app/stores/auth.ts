// ~/stores/auth.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FetchOptions } from "ofetch";
import type { User, LoginPayload, RegisterPayload, AuthResponse, MeResponse } from "~/types/auth";


export const useAuthStore = defineStore("auth", () => {
  const { $api } = useNuxtApp();
  // —— الحالة ——
  const accessToken = useCookie<string | null>("access_token", {
    default: () => null,
    maxAge: 60 * 15,
    sameSite: "lax",
  });
  const currentUser = ref<User | null>(null);
  const loading = ref(false);
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

  const isAuthenticated = computed(() => !!accessToken.value);
  
  // Initialize user on mount if token exists
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
  
  const setAccessToken = (token: string | null) => {
    accessToken.value = token;
  };

  // —— عمليات ——
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

  const logout = async () => {
    try {
      // نفضّل نعلِم السيرفر ليمسح كوكي الـ refresh
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