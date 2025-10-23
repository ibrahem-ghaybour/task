/**
 * API Composable
 * Provides a centralized way to make API requests with error handling
 */
import type { FetchOptions } from "ofetch";

export const useApi = () => {
  const { $api } = useNuxtApp();

  /**
   * Generic API request handler with error handling
   * @param url - API endpoint
   * @param options - Fetch options
   * @returns Promise with response data
   */
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

  /**
   * GET request
   */
  const get = <T>(url: string, options?: FetchOptions<"json", any>) => {
    return request<T>(url, { ...options, method: "GET" });
  };

  /**
   * POST request
   */
  const post = <T>(
    url: string,
    body?: any,
    options?: FetchOptions<"json", any>
  ) => {
    return request<T>(url, { ...options, method: "POST", body });
  };

  /**
   * PUT request
   */
  const put = <T>(
    url: string,
    body?: any,
    options?: FetchOptions<"json", any>
  ) => {
    return request<T>(url, { ...options, method: "PUT", body });
  };

  /**
   * DELETE request
   */
  const del = <T>(url: string, options?: FetchOptions<"json", any>) => {
    return request<T>(url, { ...options, method: "DELETE" });
  };

  return {
    request,
    get,
    post,
    put,
    delete: del,
  };
};
