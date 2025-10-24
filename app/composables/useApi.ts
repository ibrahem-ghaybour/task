
import type { FetchOptions } from "ofetch";

export const useApi = () => {
  const { $api } = useNuxtApp();
  const request = async <T>(
    url: string,
    options?: FetchOptions<"json", any>
  ): Promise<T> => {
    try {
      return await $api<T>(url, options);
    } catch (error: any) {
      // Extract meaningful error message
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred";
      
      throw new Error(errorMessage);
    }
  };

  const get = <T>(url: string, options?: FetchOptions<"json", any>) => {
    return request<T>(url, { ...options, method: "GET" });
  };


  const post = <T>(
    url: string,
    body?: any,
    options?: FetchOptions<"json", any>
  ) => {
    return request<T>(url, { ...options, method: "POST", body });
  };

  const put = <T>(
    url: string,
    body?: any,
    options?: FetchOptions<"json", any>
  ) => {
    return request<T>(url, { ...options, method: "PUT", body });
  };

  const patch = <T>(
    url: string,
    body?: any,
    options?: FetchOptions<"json", any>
  ) => {
    return request<T>(url, { ...options, method: "PATCH", body });
  };


  const del = <T>(url: string, options?: FetchOptions<"json", any>) => {
    return request<T>(url, { ...options, method: "DELETE" });
  };

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};
