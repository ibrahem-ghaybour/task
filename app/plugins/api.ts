import type { FetchOptions } from "ofetch";
import { ofetch } from "ofetch";
import { useAuthStore } from "@/stores/auth";
const RETRY_KEY = Symbol("retry");

type PendingRequest = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  let isRefreshing = false;
  let failedQueue: PendingRequest[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error || !token) reject(error || new Error("No token"));
      else resolve(token);
    });
    failedQueue = [];
  };

  const withAuthHeader = (
    headers: FetchOptions["headers"],
    token: string
  ): Record<string, string> => {
    const hObj: Record<string, string> = {};
    if (headers instanceof Headers) {
      headers.forEach((v, k) => (hObj[k] = v));
    } else if (Array.isArray(headers)) {
      headers.forEach(([k, v]) => (hObj[k] = v as string));
    } else if (headers) {
      Object.assign(hObj, headers as Record<string, string>);
    }
    hObj.Authorization = `Bearer ${token}`;
    return hObj;
  };

  // تحقق من انتهاء صلاحية التوكن (JWT exp) مع هامش أمان
  const isAccessTokenExpired = () => {
    const auth = useAuthStore();
    try {
      if (!auth.accessToken) return true;
      const [, payloadB64] = auth.accessToken.split(".");
      if (!payloadB64) return true;
      const payload = JSON.parse(
        atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
      );
      // console.log(payload);
      const now = Math.floor(Date.now() / 1000);
      const skew = 20; // ثواني أمان
      return typeof payload.exp === "number"
        ? now >= payload.exp - skew
        : false;
    } catch {
      return true;
    }
  };

  // تحديث التوكن single-flight مع طابور للطلبات المتزامنة
  const refreshToken = async (): Promise<string> => {
    const auth = useAuthStore();

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    isRefreshing = true;
    try {
      const response = await api<{ data: { access_token: string } }>("/auth/refresh", {
        method: "POST",
        
        noAuth: true, // مهم: لا نرسل Authorization في التحديث
      } as any);

      const newToken = response.data.access_token;
      await auth.setAccessToken(newToken);
      processQueue(null, newToken);
      return newToken;
    } catch (err) {
      processQueue(err, null);
      const auth = useAuthStore();
      auth.logout();
      throw err;
    } finally {
      isRefreshing = false;
    }
  };

  const api = ofetch.create({
    baseURL,
    

    // قبل الإرسال: نتأكد من وجود توكن صالح
    async onRequest({ request, options }) {
      const auth = useAuthStore();

      (options as any)[RETRY_KEY] = (options as any)[RETRY_KEY] ?? false;

      // طلبات عامة أو /auth/refresh
      if ((options as any).noAuth) return;

      // لو لا يوجد توكن أو منتهي: نحدّث أولاً
      if (!auth.accessToken || isAccessTokenExpired()) {
        try {
          const newToken = await refreshToken();
          (options as any).headers = withAuthHeader(options.headers, newToken);
          return;
        } catch {
          // فشل التحديث—سيُرجع السيرفر 401 ونكون قد عملنا logout
          return;
        }
      }

      // توكن صالح
      (options as any).headers = withAuthHeader(
        options.headers,
        auth.accessToken
      );
    },

    // معالجة الأخطاء وإعادة المحاولة بعد 401 مرة واحدة
    async onResponseError({ request, response, options }) {
      const auth = useAuthStore();

      if (
        response?.status === 401 &&
        !(options as any)[RETRY_KEY] &&
        !(options as any).noAuth
      ) {
        (options as any)[RETRY_KEY] = true;

        try {
          const newToken = await refreshToken();
          (options as any).headers = withAuthHeader(options.headers, newToken);
          // مهم: إعادة الطلب مع نفس الـ request + options
          return api(request as any, options as any);
        } catch (err) {
          auth.logout();
          return Promise.reject(err);
        }
      }

      throw (
        response?._data?.errors[0]?.msg ??
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
    noAuth?: boolean;
  }
}
