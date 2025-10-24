
<script setup lang="ts">
import type { Product } from "~/types/product";
import { Package, Plus, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/products/ProductCard.vue";
import Pagination from "@/components/products/Pagination.vue";

// Page metadata - requires authentication
definePageMeta({
  middleware: "auth",
});

// Composables
const productsApi = useProducts();
const toastNotification = useToast();
const router = useRouter();

// State
const products = ref<Product[]>([]);
const pagination = ref({
  current_page: 1,
  per_page: 5,
  total: 0,
  last_page: 1,
});
const deletingId = ref<number | null>(null);

/**
 * Fetch products on component mount
 * Loads initial page with default pagination
 */
onMounted(async () => {
  await loadProducts(1, 5);
});

/**
 * Load products with error handling
 * @param page - Page number to load
 * @param perPage - Items per page
 */
const loadProducts = async (page: number, perPage: number) => {
  try {
    const response = await productsApi.fetchProducts(page, perPage);
    
    // Update local state with fetched data
    products.value = response.data.products;
    if (response.data.pagination) {
      pagination.value = response.data.pagination;
    }
  } catch (error: any) {
    toastNotification.error(
      "Failed to load products",
      error?.message || "Please try again later"
    );
  }
};

/**
 * Navigate to specific page
 * @param page - Target page number
 */
const goToPage = async (page: number) => {
  await loadProducts(page, pagination.value.per_page);
};

/**
 * Delete product with confirmation
 * @param id - Product ID to delete
 */
const handleDelete = async (id: number) => {
  // Confirm deletion
  if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
    return;
  }

  deletingId.value = id;
  
  try {
    await productsApi.deleteProduct(id);
    
    // Remove from local state
    products.value = products.value.filter(p => p.id !== id);
    
    toastNotification.success("Product deleted successfully");
  } catch (error: any) {
    toastNotification.error(
      "Failed to delete product",
      error?.message || "Please try again later"
    );
  } finally {
    deletingId.value = null;
  }
};

/**
 * Navigate to product details page
 * @param id - Product ID
 */
const viewProduct = (id: number) => {
  router.push(`/products/${id}`);
};

/**
 * Navigate to create product page
 */
const createProduct = () => {
  router.push("/products/create");
};
</script>

<template>

</template>
