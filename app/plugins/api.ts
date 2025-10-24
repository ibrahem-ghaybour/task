import type { FetchOptions } from "ofetch";
import { ofetch } from "ofetch";
import { useAuthStore } from "@/stores/auth";

const RETRY_KEY = Symbol("retry");

// -------- Helpers --------

/** يدمج الهيدرز ويضيف Authorization */
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
  // لا نُكرر Bearer إن كان موجودًا بالأساس
  hObj.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  return hObj;
};

/** يفك payload للـ JWT بطريقة تعمل على المتصفح والسيرفر */
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

/** يتحقق من انتهاء صلاحية التوكن (بهامش أمان) */
const isAccessTokenExpired = (token?: string | null) => {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  const now = Math.floor(Date.now() / 1000);
  const skew = 20; // هامش أمان بالثواني
  return now >= Math.floor(payload.exp) - skew;
};

/** تسجيل الخروج والتوجيه للّوجن */
const forceLogoutAndRedirect = async () => {
  const auth = useAuthStore();
  auth.logout?.();
  // تجنب استخدام navigateTo على السيرفر
  if (process.client) {
    const { navigateTo } = await import("#app");
    navigateTo("/login");
  }
};

// -------- Nuxt Plugin --------

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl; // تأكد من ضبطه في nuxt.config

  const api = ofetch.create({
    baseURL,

    // قبل كل طلب
    async onRequest({ options }) {
      const auth = useAuthStore();

      // Flag لمنع إعادة المحاولة اللانهائية عند 401
      (options as any)[RETRY_KEY] = (options as any)[RETRY_KEY] ?? false;

      // طلبات عامة (مثل /api/login)
      if ((options as any).noAuth) return;

      // لو لا يوجد توكن أو منتهي → خروج وتوجيه
      if (isAccessTokenExpired(auth.accessToken)) {
        await forceLogoutAndRedirect();
        // نسمح للطلب أن يُرسل بدون توكن (قد يكون endpoint عام)،
        // لكن غالباً سيُرفض من السيرفر.
        return;
      }

      // توكن صالح → أضف الهيدر
      (options as any).headers = withAuthHeader(
        options.headers,
        auth.accessToken as string
      );
    },

    // بعد الرد مع خطأ
    async onResponseError({ request, response, options }) {
      const auth = useAuthStore();

      // لو 401 ولم نحاول قبل كذا
      if (
        response?.status === 401 &&
        !(options as any)[RETRY_KEY] &&
        !(options as any).noAuth
      ) {
        (options as any)[RETRY_KEY] = true;

        // لا يوجد refresh في الـ API → نسجل خروج ونوجه
        await forceLogoutAndRedirect();
        return Promise.reject(response?._data ?? response);
      }

      // أرجع رسالة واضحة
      throw (
        response?._data?.errors?.[0]?.msg ??
        response?._data?.message ??
        response?._data ??
        response
      );
    },
  });

  // توفّر $api للتطبيق كله
  nuxtApp.provide("api", api);
});

// ---- Augmentations ----

// تعريف $api على NuxtApp و Vue
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

// السماح بخيار noAuth داخل ofetch
declare module "ofetch" {
  interface FetchOptions {
    /** اجعلها true للطلبات العامة مثل /api/login */
    noAuth?: boolean;
  }
}
