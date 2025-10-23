/**
 * Products List Page
 * Displays paginated product list with CRUD operations
 * Uses composables for data fetching and state management
 */
<script setup lang="ts">
import { useProductsStore } from "~/stores/products";
import { Package, Plus, Eye, Trash2, Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Page metadata - requires authentication
definePageMeta({
  middleware: "auth",
});

// Composables
const productsApi = useProducts();
const productsStore = useProductsStore();
const toastNotification = useToast();
const router = useRouter();

// Loading state for delete operations
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
    
    // Update store with fetched data
    productsStore.products = response.data.products;
    if (response.data.pagination) {
      productsStore.pagination = response.data.pagination;
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
  await loadProducts(page, productsStore.pagination.per_page);
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
    
    // Remove from store
    productsStore.products = productsStore.products.filter(p => p.id !== id);
    
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
    <Card v-else-if="!productsStore.products.length" class="py-20">
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
    <div v-else>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="product in productsStore.products"
          :key="product.id"
          class="hover:shadow-lg transition-shadow"
        >
          <CardHeader>
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <CardTitle class="line-clamp-1">{{ product.name }}</CardTitle>
                <CardDescription class="mt-1">
                  SKU: {{ product.sku }}
                </CardDescription>
              </div>
              <div
                v-if="product.featured"
                class="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded"
              >
                Featured
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <!-- Price Info -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Selling Price</span>
                <span class="font-semibold">${{ product.selling_price }}</span>
              </div>

              <!-- Stock Info -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Stock</span>
                <span
                  :class="[
                    'font-semibold',
                    product.quantity > 0 ? 'text-green-600' : 'text-red-600',
                  ]"
                >
                  {{ product.quantity }} units
                </span>
              </div>

              <!-- Online Status -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Status</span>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded',
                    product.isOnline
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700',
                  ]"
                >
                  {{ product.isOnline ? "Online" : "Offline" }}
                </span>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  class="flex-1"
                  @click="viewProduct(product.id)"
                >
                  <Eye class="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  :disabled="deletingId === product.id"
                  @click="handleDelete(product.id)"
                >
                  <Loader2 v-if="deletingId === product.id" class="h-4 w-4 animate-spin" />
                  <Trash2 v-else class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Pagination -->
      <div
        v-if="productsStore.pagination.last_page > 1"
        class="flex items-center justify-center gap-2 mt-8"
      >
        <Button
          variant="outline"
          size="sm"
          :disabled="productsStore.pagination.current_page === 1"
          @click="goToPage(productsStore.pagination.current_page - 1)"
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>

        <div class="flex items-center gap-1">
          <template
            v-for="page in productsStore.pagination.last_page"
            :key="page"
          >
            <Button
              v-if="
                page === 1 ||
                page === productsStore.pagination.last_page ||
                Math.abs(page - productsStore.pagination.current_page) <= 1
              "
              :variant="
                page === productsStore.pagination.current_page
                  ? 'default'
                  : 'outline'
              "
              size="sm"
              @click="goToPage(page)"
            >
              {{ page }}
            </Button>
            <span
              v-else-if="
                page === productsStore.pagination.current_page - 2 ||
                page === productsStore.pagination.current_page + 2
              "
              class="px-2"
            >
              ...
            </span>
          </template>
        </div>

        <Button
          variant="outline"
          size="sm"
          :disabled="
            productsStore.pagination.current_page ===
            productsStore.pagination.last_page
          "
          @click="goToPage(productsStore.pagination.current_page + 1)"
        >
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>

      <!-- Pagination Info -->
      <p class="text-center text-sm text-muted-foreground mt-4">
        Showing {{ productsStore.products.length }} of
        {{ productsStore.pagination.total }} products
      </p>
    </div>
  </div>
</template>
