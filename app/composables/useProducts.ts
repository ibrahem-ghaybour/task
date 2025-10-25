/**
 * Products Composable
 * Handles all product-related API operations with loading and error states
 */
import { toast } from "vue-sonner";
import type {
  CreateProductPayload,
  ProductsListResponse,
  ProductDetailResponse,
  CreateProductResponse,
} from "~/types/product";

export const useProducts = () => {
  const api = useApi();
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch paginated products list
   * @param page - Page number
   * @param perPage - Items per page
   */
  const fetchProducts = async (page: number = 1, perPage: number = 5) => {
    loading.value = true;
    error.value = null;

    try {
      console.log(`Fetching products: page=${page}, perPage=${perPage}`);
      const response = await api.get<ProductsListResponse>(
        `/dashboard/products?page=${page}&per_page=${perPage}`
      );
      console.log('Raw API response:', response);
      return response;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch single product by ID
   * @param id - Product ID
   */
  const fetchProductById = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get<ProductDetailResponse>(
        `/dashboard/products/${id}`
      );
      return response;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create new product
   * @param payload - Product data
   */
  const createProduct = async (payload: CreateProductPayload) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<CreateProductResponse>(
        "/dashboard/products",
        payload
      );
      return response;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update existing product
   * @param id - Product ID
   * @param payload - Updated product data
   */
  const updateProduct = async (
    id: number,
    payload: Partial<CreateProductPayload>
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.patch<CreateProductResponse>(
        `/dashboard/products/${id}`,
        payload
      );
      return response;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete product
   * @param id - Product ID
   */
  const deleteProduct = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await api.delete(`/dashboard/products/${id}`);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
