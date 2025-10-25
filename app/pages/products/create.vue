<script setup lang="ts">
import ProductForm from "@/components/products/ProductForm.vue";
import { useProductsStore } from "~/stores/products";


const productsStore = useProductsStore();
const toast = useToast();
const router = useRouter();

const loading = computed(() => productsStore.loading);

const handleSubmit = async (payload: any) => {
  try {
    console.log("payload")
    const res = await productsStore.createProduct(payload);
    toast.success("Product created successfully");
    router.push(`/products/${res.data.product.id}`);
  } catch (e: any) {
    toast.error("Failed to create product", e?.message || "");
  }
};

const handleCancel = () => router.push("/products");
</script>

<template>
  <div class="space-y-6">
    <ProductForm :loading="loading" submit-text="Create Product" @submit="console.log('submit')" @cancel="handleCancel" />
  </div>
</template>
