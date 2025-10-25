<script setup lang="ts">
import type { Product } from "~/types/product";
import ProductForm from "@/components/products/ProductForm.vue";
import { useProductsStore } from "~/stores/products";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-vue-next";


const route = useRoute();
const router = useRouter();
const toast = useToast();
const productsStore = useProductsStore();

const product = ref<Product | null>(null);

onMounted(async () => {
  const id = Number(route.params.id);
  try {
    const res = await productsStore.fetchProductById(id);
    product.value = res.data;
  } catch (e: any) {
    toast.error("Failed to load product", e?.message || "");
  }
});

const handleSubmit = async (payload: any) => {
  try {
    if (!product.value) return;
    await productsStore.updateProduct(product.value.id, payload);
    toast.success("Product updated successfully");
    router.push(`/products/${product.value.id}`);
  } catch (e: any) {
    toast.error("Failed to update product", e?.message || "");
  }
};

const handleCancel = () => router.push(`/products/${route.params.id}`);
const loading = computed(() => productsStore.loading);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <Button variant="outline" size="sm" @click="handleCancel">
        <ArrowLeft class="mr-2 h-4 w-4" /> Back
      </Button>
    </div>

    <ProductForm
      v-if="product"
      :product="product"
      :loading="loading"
      submit-text="Update Product"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
