<script setup lang="ts">
import { useProductsStore } from "~/stores/products";
import { toast } from "vue-sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import type { CreateProductPayload } from "~/types/product";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();
const productsStore = useProductsStore();

const formData = ref<CreateProductPayload>({
  name: "",
  keywords_seo_ar: "",
  keywords_seo_en: "",
  description_seo_ar: "",
  description_seo_en: "",
  description: "",
  category: 0,
  brand: 0,
  unit: 0,
  quantity: 0,
  featured: 0,
  isOnline: 0,
  online_units: 1,
  max_order: 0,
  buying_price: 0,
  selling_price: 0,
  tax: 0,
  sku: "",
});

const handleSubmit = async () => {
  try {
    await productsStore.createProduct(formData.value);
    toast.success("Product created successfully");
    router.push("/products");
  } catch (error: any) {
    toast.error("Failed to create product", {
      description: error?.message || "Please try again",
    });
  }
};

const goBack = () => router.push("/products");
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="h-5 w-5" />
      </Button>
      <h1 class="text-4xl font-bold">Create Product</h1>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-6">
        <!-- Basic Info -->
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <FormLabel>Product Name *</FormLabel>
              <Input v-model="formData.name" required />
            </div>
            <div>
              <FormLabel>SKU *</FormLabel>
              <Input v-model="formData.sku" required />
            </div>
            <div>
              <FormLabel>Description</FormLabel>
              <textarea
                v-model="formData.description"
                class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Pricing -->
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent class="grid md:grid-cols-3 gap-4">
            <div>
              <FormLabel>Buying Price</FormLabel>
              <Input v-model.number="formData.buying_price" type="number" step="0.01" />
            </div>
            <div>
              <FormLabel>Selling Price *</FormLabel>
              <Input v-model.number="formData.selling_price" type="number" step="0.01" required />
            </div>
            <div>
              <FormLabel>Tax (%)</FormLabel>
              <Input v-model.number="formData.tax" type="number" step="0.01" />
            </div>
          </CardContent>
        </Card>

        <!-- Inventory -->
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent class="grid md:grid-cols-3 gap-4">
            <div>
              <FormLabel>Quantity</FormLabel>
              <Input v-model.number="formData.quantity" type="number" />
            </div>
            <div>
              <FormLabel>Online Units</FormLabel>
              <Input v-model.number="formData.online_units" type="number" />
            </div>
            <div>
              <FormLabel>Max Order</FormLabel>
              <Input v-model.number="formData.max_order" type="number" />
            </div>
          </CardContent>
        </Card>

        <!-- Classification -->
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent class="grid md:grid-cols-3 gap-4">
            <div>
              <FormLabel>Category ID *</FormLabel>
              <Input v-model.number="formData.category" type="number" required />
            </div>
            <div>
              <FormLabel>Brand ID *</FormLabel>
              <Input v-model.number="formData.brand" type="number" required />
            </div>
            <div>
              <FormLabel>Unit ID *</FormLabel>
              <Input v-model.number="formData.unit" type="number" required />
            </div>
          </CardContent>
        </Card>

        <!-- SEO -->
        <Card>
          <CardHeader>
            <CardTitle>SEO (Optional)</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Keywords (Arabic)</FormLabel>
                <Input v-model="formData.keywords_seo_ar" />
              </div>
              <div>
                <FormLabel>Keywords (English)</FormLabel>
                <Input v-model="formData.keywords_seo_en" />
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Description (Arabic)</FormLabel>
                <Input v-model="formData.description_seo_ar" />
              </div>
              <div>
                <FormLabel>Description (English)</FormLabel>
                <Input v-model="formData.description_seo_en" />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Status -->
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-2">
              <input
                id="featured"
                v-model="formData.featured"
                type="checkbox"
                :true-value="1"
                :false-value="0"
                class="h-4 w-4"
              />
              <label for="featured" class="text-sm font-medium">Featured Product</label>
            </div>
            <div class="flex items-center gap-2">
              <input
                id="online"
                v-model="formData.isOnline"
                type="checkbox"
                :true-value="1"
                :false-value="0"
                class="h-4 w-4"
              />
              <label for="online" class="text-sm font-medium">Available Online</label>
            </div>
          </CardContent>
        </Card>

        <!-- Actions -->
        <div class="flex gap-4">
          <Button type="submit" :disabled="productsStore.loading" size="lg">
            <Loader2 v-if="productsStore.loading" class="mr-2 h-4 w-4 animate-spin" />
            <Save v-else class="mr-2 h-4 w-4" />
            {{ productsStore.loading ? "Creating..." : "Create Product" }}
          </Button>
          <Button type="button" variant="outline" @click="goBack" size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>
