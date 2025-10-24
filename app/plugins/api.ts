import type { FetchOptions } from "ofetch";
import { ofetch } from "ofetch";
import { useAuthStore } from "@/stores/auth";

const RETRY_KEY = Symbol("retry");


const withAuthHeader = (
  headers: FetchOptions["headers"],
  token: string
): Record<string, string> => {
  const hObj: Record<string, string> = {};
  if (headers instanceof Headers) {
    headers.forEach((v, k) => (hObj[k] = v));
  } else if (Array.isArray(headers)) {
    headers.forEach(([k, v]) => (hObj[k] = (v as string) ?? ""));
  } else if (headers) {
    Object.assign(hObj, headers as Record<string, string>);
  }
  hObj.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  return hObj;
};

const decodeJwtPayload = (token: string): any | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json =
      process.client
        ? atob(b64)
        : Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isAccessTokenExpired = (token?: string | null) => {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  const now = Math.floor(Date.now() / 1000);
  const skew = 20;
  return now >= Math.floor(payload.exp) - skew;
};

const forceLogoutAndRedirect = async () => {
  const auth = useAuthStore();
  auth.logout?.();
    const { navigateTo } = await import("#app");
    navigateTo("/login");
};


export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl; 

  const api = ofetch.create({
    baseURL,

    async onRequest({ options }) {
      const auth = useAuthStore();

      (options as any)[RETRY_KEY] = (options as any)[RETRY_KEY] ?? false;

      if ((options as any).noAuth) return;

      if (isAccessTokenExpired(auth.accessToken)) {
        await forceLogoutAndRedirect();
        return;
      }

      (options as any).headers = withAuthHeader(
        options.headers,
        auth.accessToken as string
      );
    },

    async onResponseError({ response, options }) {

      if (
        response?.status === 401 &&
        !(options as any)[RETRY_KEY] &&
        !(options as any).noAuth
      ) {
        (options as any)[RETRY_KEY] = true;

        await forceLogoutAndRedirect();
        return Promise.reject(response?._data ?? response);
      }

      throw (
        response?._data?.errors?.[0]?.msg ??
        response?._data?.message ??
        response?._data ??
        response
      );
    },
  });

  nuxtApp.provide("api", api);
});

declare module "#app" {
  interface NuxtApp {
    $api: ReturnType<typeof ofetch.create>;
  }
}
declare module "vue" {
  interface ComponentCustomProperties {
    $api: ReturnType<typeof ofetch.create>;
  }
}

declare module "ofetch" {
  interface FetchOptions {
    noAuth?: boolean;
  }
}
