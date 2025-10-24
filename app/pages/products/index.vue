
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
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold">Products</h1>
        <p class="text-muted-foreground mt-2">
          Manage your product inventory
        </p>
      </div>
      <Button @click="createProduct" size="lg">
        <Plus class="mr-2 h-5 w-5" />
        Add Product
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="productsApi.loading.value" class="flex items-center justify-center py-20">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
      <p class="ml-3 text-muted-foreground">Loading products...</p>
    </div>

    <!-- Empty State -->
    <Card v-else-if="!products.length" class="py-20">
      <CardContent class="flex flex-col items-center justify-center text-center">
        <Package class="h-16 w-16 text-muted-foreground mb-4" />
        <h3 class="text-xl font-semibold mb-2">No products found</h3>
        <p class="text-muted-foreground mb-6">
          Get started by creating your first product
        </p>
        <Button @click="createProduct">
          <Plus class="mr-2 h-4 w-4" />
          Create Product
        </Button>
      </CardContent>
    </Card>

    <!-- Products Grid -->
    <div v-else class="space-y-8">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :is-deleting="deletingId === product.id"
          @view="viewProduct"
          @delete="handleDelete"
        />
      </div>

      <!-- Pagination Component -->
      <Pagination
        :current-page="pagination.current_page"
        :total-pages="pagination.last_page"
        :total-items="pagination.total"
        :displayed-items="products.length"
        @change-page="goToPage"
      />
    </div>
  </div>
</template>
