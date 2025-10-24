<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/products/ProductForm.vue";
import type { CreateProductPayload } from "~/types/product";

/**
 * Product Create Page
 * Allows creating new products with validation
 */

definePageMeta({
  middleware: "auth",
});

const router = useRouter();
const productsApi = useProducts();
const toastNotification = useToast();

const submitting = ref(false);

/**
 * Handle form submission
 */
const handleSubmit = async (payload: CreateProductPayload) => {
  submitting.value = true;
  try {
    await productsApi.createProduct(payload);
    toastNotification.success("Product created successfully");
    router.push("/products");
  } catch (error: any) {
    toastNotification.error(
      "Failed to create product",
      error?.message || "Please try again"
    );
  } finally {
    submitting.value = false;
  }
};

/**
 * Handle cancel action
 */
const handleCancel = () => {
  router.push("/products");
};

/**
 * Go back to products list
 */
const goBack = () => {
  router.push("/products");
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="h-5 w-5" />
      </Button>
      <h1 class="text-4xl font-bold">Create Product</h1>
    </div>

    <!-- Product Form -->
    <ProductForm
      :loading="submitting"
      submit-text="Create Product"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
