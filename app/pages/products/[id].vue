<script setup lang="ts">
import { useProductsStore } from "~/stores/products";
import { toast } from "vue-sonner";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Tag,
  Loader2,
  Edit,
  Trash2,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();

const productId = computed(() => Number(route.params.id));

// Fetch product on mount
onMounted(async () => {
  try {
    await productsStore.fetchProductById(productId.value);
  } catch (error: any) {
    toast.error("Failed to load product", {
      description: error?.message || "Please try again later",
    });
    router.push("/products");
  }
});

// Delete product handler
const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await productsStore.deleteProduct(productId.value);
    toast.success("Product deleted successfully");
    router.push("/products");
  } catch (error: any) {
    toast.error("Failed to delete product", {
      description: error?.message || "Please try again later",
    });
  }
};

// Edit product
const editProduct = () => {
  router.push(`/products/${productId.value}/edit`);
};

// Go back
const goBack = () => {
  router.push("/products");
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="h-5 w-5" />
      </Button>
      <div class="flex-1">
        <h1 class="text-4xl font-bold">Product Details</h1>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="editProduct">
          <Edit class="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" @click="handleDelete">
          <Trash2 class="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="productsStore.loading"
      class="flex items-center justify-center py-20"
    >
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Product Details -->
    <div v-else-if="productsStore.currentProduct" class="grid gap-6 lg:grid-cols-3">
      <!-- Main Info -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <div class="flex items-start justify-between">
            <div>
              <CardTitle class="text-2xl">
                {{ productsStore.currentProduct.name }}
              </CardTitle>
              <CardDescription class="mt-2">
                SKU: {{ productsStore.currentProduct.sku }}
              </CardDescription>
            </div>
            <div
              v-if="productsStore.currentProduct.featured"
              class="px-3 py-1 text-sm font-semibold bg-primary/10 text-primary rounded"
            >
              Featured
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Description -->
          <div>
            <h3 class="font-semibold mb-2">Description</h3>
            <div
              class="prose prose-sm max-w-none"
              v-html="productsStore.currentProduct.description"
            ></div>
          </div>

          <!-- SEO Keywords -->
          <div class="grid md:grid-cols-2 gap-4">
            <div v-if="productsStore.currentProduct.keywords_seo_ar">
              <h3 class="font-semibold mb-2">SEO Keywords (Arabic)</h3>
              <p class="text-sm text-muted-foreground">
                {{ productsStore.currentProduct.keywords_seo_ar }}
              </p>
            </div>
            <div v-if="productsStore.currentProduct.keywords_seo_en">
              <h3 class="font-semibold mb-2">SEO Keywords (English)</h3>
              <p class="text-sm text-muted-foreground">
                {{ productsStore.currentProduct.keywords_seo_en }}
              </p>
            </div>
          </div>

          <!-- SEO Descriptions -->
          <div class="grid md:grid-cols-2 gap-4">
            <div v-if="productsStore.currentProduct.description_seo_ar">
              <h3 class="font-semibold mb-2">SEO Description (Arabic)</h3>
              <p class="text-sm text-muted-foreground">
                {{ productsStore.currentProduct.description_seo_ar }}
              </p>
            </div>
            <div v-if="productsStore.currentProduct.description_seo_en">
              <h3 class="font-semibold mb-2">SEO Description (English)</h3>
              <p class="text-sm text-muted-foreground">
                {{ productsStore.currentProduct.description_seo_en }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Sidebar Info -->
      <div class="space-y-6">
        <!-- Pricing Card -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <DollarSign class="h-5 w-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Buying Price</span>
              <span class="font-semibold">
                ${{ productsStore.currentProduct.buying_price }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Selling Price</span>
              <span class="font-semibold text-lg">
                ${{ productsStore.currentProduct.selling_price }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Tax</span>
              <span class="font-semibold">
                {{ productsStore.currentProduct.tax }}%
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- Inventory Card -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Package class="h-5 w-5" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Quantity</span>
              <span
                :class="[
                  'font-semibold',
                  productsStore.currentProduct.quantity > 0
                    ? 'text-green-600'
                    : 'text-red-600',
                ]"
              >
                {{ productsStore.currentProduct.quantity }} units
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Online Units</span>
              <span class="font-semibold">
                {{ productsStore.currentProduct.online_units }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Max Order</span>
              <span class="font-semibold">
                {{ productsStore.currentProduct.max_order || "Unlimited" }}
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- Category & Brand Card -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Tag class="h-5 w-5" />
              Classification
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Category ID</span>
              <span class="font-semibold">
                {{ productsStore.currentProduct.category }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Brand ID</span>
              <span class="font-semibold">
                {{ productsStore.currentProduct.brand }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Unit ID</span>
              <span class="font-semibold">
                {{ productsStore.currentProduct.unit }}
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- Status Card -->
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Online</span>
              <span
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded',
                  productsStore.currentProduct.isOnline
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700',
                ]"
              >
                {{ productsStore.currentProduct.isOnline ? "Yes" : "No" }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Featured</span>
              <span
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded',
                  productsStore.currentProduct.featured
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-700',
                ]"
              >
                {{ productsStore.currentProduct.featured ? "Yes" : "No" }}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Error State -->
    <Card v-else class="py-20">
      <CardContent class="flex flex-col items-center justify-center text-center">
        <Package class="h-16 w-16 text-muted-foreground mb-4" />
        <h3 class="text-xl font-semibold mb-2">Product not found</h3>
        <p class="text-muted-foreground mb-6">
          The product you're looking for doesn't exist
        </p>
        <Button @click="goBack">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
