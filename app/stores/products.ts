/**
 * Products Store
 * Global state management for products using Pinia
 * Stores product data, pagination, and loading states
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import type { FetchOptions } from "ofetch";
import type {
  Product,
  CreateProductPayload,
  ProductsListResponse,
  ProductDetailResponse,
  CreateProductResponse,
} from "~/types/product";

export const useProductsStore = defineStore("products", () => {
  const { $api } = useNuxtApp();

  // ========== State ==========
  
  /** Array of products for list view */
  const products = ref<Product[]>([]);
  
  /** Currently selected product for detail view */
  const currentProduct = ref<Product | null>(null);
  
  /** Loading state for async operations */
  const loading = ref(false);
  
  /** Pagination metadata */
  const pagination = ref({
    current_page: 1,
    per_page: 5,
    total: 0,
    last_page: 1,
  });

  // ========== Actions ==========

  /**
   * Fetch paginated products list
   * @param page - Page number (default: 1)
   * @param perPage - Items per page (default: 5)
   * @returns Promise with products response
   */
  const fetchProducts = async (page: number = 1, perPage: number = 5) => {
    loading.value = true;
    try {
      const response = await $api<ProductsListResponse>(
        `/dashboard/products?page=${page}&per_page=${perPage}`,
        {
          method: "GET",
        } as FetchOptions<"json", any>
      );

      products.value = response.data.products;
      if (response.data.pagination) {
        pagination.value = response.data.pagination;
      }

      return response;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch single product details by ID
   * @param id - Product ID
   * @returns Promise with product response
   */
  const fetchProductById = async (id: number) => {
    loading.value = true;
    try {
      const response = await $api<ProductDetailResponse>(
        `/dashboard/products/${id}`,
        {
          method: "GET",
        } as FetchOptions<"json", any>
      );

      currentProduct.value = response.data.product;
      return response;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new product
   * @param payload - Product data
   * @returns Promise with created product response
   */
  const createProduct = async (payload: CreateProductPayload) => {
    loading.value = true;
    try {
      const response = await $api<CreateProductResponse>(
        "/dashboard/products",
        {
          method: "POST",
          body: payload,
        } as FetchOptions<"json", any>
      );

      // Add new product to the list
      if (response.data.product) {
        products.value.unshift(response.data.product);
      }

      return response;
    } catch (error) {
      console.error("Failed to create product:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update an existing product
   * @param id - Product ID to update
   * @param payload - Updated product data (partial)
   * @returns Promise with updated product response
   */
  const updateProduct = async (id: number, payload: Partial<CreateProductPayload>) => {
    loading.value = true;
    try {
      const response = await $api<CreateProductResponse>(
        `/dashboard/products/${id}`,
        {
          method: "PUT",
          body: payload,
        } as FetchOptions<"json", any>
      );

      // Update product in the list
      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1 && response.data.product) {
        products.value[index] = response.data.product;
      }

      if (currentProduct.value?.id === id && response.data.product) {
        currentProduct.value = response.data.product;
      }

      return response;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete a product by ID
   * @param id - Product ID to delete
   * @returns Promise that resolves when deletion is complete
   */
  const deleteProduct = async (id: number) => {
    loading.value = true;
    try {
      await $api(`/dashboard/products/${id}`, {
        method: "DELETE",
      } as FetchOptions);

      // Remove product from the list
      products.value = products.value.filter((p) => p.id !== id);

      if (currentProduct.value?.id === id) {
        currentProduct.value = null;
      }
    } catch (error) {
      console.error(`Failed to delete product ${id}:`, error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    products,
    currentProduct,
    loading,
    pagination,

    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});
