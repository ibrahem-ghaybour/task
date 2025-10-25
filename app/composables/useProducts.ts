/**
 * Products Composable
 * Provides product-related functionality
 */
import { useProductsStore } from "~/stores/products";
import type { CreateProductPayload } from "~/types/product";

export const useProducts = () => {
  const productsStore = useProductsStore();
  const toast = useToast();

  const fetchProducts = async (page: number = 1, perPage: number = 5) => {
    try {
      const response = await productsStore.fetchProducts(page, perPage);
      return response;
    } catch (error: any) {
      console.error("Fetch products error:", error);
      throw error;
    }
  };

  const fetchProductById = async (id: number) => {
    try {
      const response = await productsStore.fetchProductById(id);
      return response;
    } catch (error: any) {
      console.error("Fetch product error:", error);
      throw error;
    }
  };

  const createProduct = async (payload: CreateProductPayload) => {
    try {
      const response = await productsStore.createProduct(payload);
      return response;
    } catch (error: any) {
      console.error("Create product error:", error);
      throw error;
    }
  };

  const updateProduct = async (id: number, payload: Partial<CreateProductPayload>) => {
    try {
      const response = await productsStore.updateProduct(id, payload);
      return response;
    } catch (error: any) {
      console.error("Update product error:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await productsStore.deleteProduct(id);
    } catch (error: any) {
      console.error("Delete product error:", error);
      throw error;
    }
  };

  return {
    // State
    products: computed(() => productsStore.products),
    productDetail: computed(() => productsStore.productDetail),
    pagination: computed(() => productsStore.pagination),
    loading: computed(() => productsStore.loading),
    error: computed(() => productsStore.error),
    
    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};