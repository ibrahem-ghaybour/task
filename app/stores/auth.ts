import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FetchOptions } from "ofetch";
import type { LoginPayload, AuthResponse, MeResponse, User } from "~/types/auth";

export const useAuthStore = defineStore("auth", () => {
  const { $api } = useNuxtApp();
  const toast = useToast();
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const accessToken = useCookie<string | null>("access_token", {
    default: () => null,
    maxAge: 60 * 15,
    sameSite: "lax",
  });

  const isAuthenticated = computed(() => !!accessToken.value);

  const setAccessToken = (token: string | null) => {
    accessToken.value = token;
  };

  const login = async (payload: LoginPayload) => {
    loading.value = true;
    try {
      const res = await $api<AuthResponse>("/login", {
        method: "POST",
        body: payload,
        noAuth: true,
      } as FetchOptions<"json", any>);
      if (res.status === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      setAccessToken(res.data.access_token);
      myProfile();
      return res;
    } catch (err: any) {
      toast.error(err.message);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    loading.value = false;
    toast.success("Logged out successfully");
    accessToken.value = null;
    navigateTo("/auth/login");
  };

  const myProfile = async () => {
    try {
    loading.value = true;
      const res = await $api<MeResponse>("/dashboard/me", {
        method: "GET",
      } as FetchOptions<"json", any>);
      user.value = res.data;
    } catch (err: any) {
      toast.error(err.message);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    accessToken,
    error,
    loading,
    isAuthenticated,
    user,
    setAccessToken,
    login,
    logout,
    myProfile,
  };
});
