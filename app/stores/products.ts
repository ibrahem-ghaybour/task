import { ref } from "vue";
import { defineStore } from "pinia";
import type {
  CreateProductPayload,
  ProductsListResponse,
  ProductDetailResponse,
  CreateProductResponse,
  Product,
  Pagination,
} from "~/types/product";

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const pagination = ref<Pagination | null>(null);
  const productDetail = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const api = useApi();
  const toast = useToast();

  async function fetchProducts(page: number = 1, perPage: number = 5) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get<ProductsListResponse>(
        `/dashboard/products?page=${page}&per_page=${perPage}`
      );
      products.value = response.data;
      pagination.value = response.meta;
      return response;
    } catch (err: any) {
      error.value = err.message;
      toast.error("Failed to load products");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProductById(id: number) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get<ProductDetailResponse>(
        `/dashboard/products/${id}`
      );
      productDetail.value = response.data;
      return response;
    } catch (err: any) {
      error.value = err.message;
      toast.error("Failed to load product details");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createProduct(payload: CreateProductPayload) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.patch<CreateProductResponse>(
        "/dashboard/products",
        payload
      );
      toast.success("Product created successfully!");
      await fetchProducts();
      return response;
    } catch (err: any) {
      error.value = err.message;
      toast.error("Failed to create product");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateProduct(id: number, payload: Partial<CreateProductPayload>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.patch<CreateProductResponse>(
        `/dashboard/products/${id}`,
        payload
      );
      toast.success("Product updated successfully!");
      await fetchProducts();
      return response;
    } catch (err: any) {
      error.value = err.message;
      toast.error("Failed to update product");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProduct(id: number) {
    loading.value = true;
    error.value = null;

    try {
      await api.delete(`/dashboard/products/${id}`);
      products.value = products.value.filter((p) => p.id !== id);
      toast.success("Product deleted");
    } catch (err: any) {
      error.value = err.message;

      // ✅ معالجة خاصة للمنتجات المستوردة
      const msg = err.response?._data?.message;
      if (msg?.includes("imported")) {
        toast.warning("This product was imported and cannot be deleted.");
      } else {
        toast.error("Failed to delete product");
      }

      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 🧾 التصدير النهائي
  return {
    products,
    pagination,
    productDetail,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});
