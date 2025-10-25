<script setup lang="ts">
import type { Product } from "~/types/product";
import { Package, Plus, Loader2, Wheat } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Pagination from "@/components/products/Pagination.vue";
import ProductTable from "@/components/products/ProductTable.vue";



const productsStore = useProductsStore();
const pagination = computed(() => productsStore.pagination);
const toast = useToast();
const router = useRouter();

const products = ref<Product[]>([]);

const deletingId = ref<number | null>(null);
const perPageOptions = [5, 10, 20, 50];
onMounted( () => {
  if(productsStore.products.length === 0) {
    productsStore.fetchProducts(1, pagination.value?.per_page || 5);
  }
});

const loadProducts = (page: number, perPage: number) => {
    productsStore.fetchProducts(page, perPage)
};

const goToPage = async (page: number) => {
  productsStore.pagination!.current_page = page;
  loadProducts(page, pagination.value?.per_page || 5);
};

const handlePerPageChange =  (newPerPage: number) => {
  productsStore.pagination!.per_page = newPerPage;
   loadProducts(1, newPerPage);
};


const handleDelete = async (id: number) => {
  // if (!confirm("Delete this product? This action cannot be undone.")) return;
  deletingId.value = id;
  try {
    await productsStore.deleteProduct(id);
    toast.success("Product deleted successfully");
  } catch (error: any) {
  } finally {
    deletingId.value = null;
  }
};

const viewProduct = (id: number) => router.push(`/products/${id}`);
const editProduct = (id: number) => router.push(`/products/${id}/edit`);
const createProduct = () => router.push("/products/create");

</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Package class="h-5 w-5" />
        <h1 class="text-xl font-semibold">Products</h1>
      </div>
      <Button size="sm" @click="createProduct">
        <Plus class="mr-2 h-4 w-4" /> New Product
      </Button>
    </div>

    <div v-if="productsStore.loading" class="flex items-center justify-center py-8">
      <Loader2 class="h-6 w-6 animate-spin mr-2" />
      <span>Loading products...</span>
    </div>

    <div v-if="!productsStore.loading" class="text-sm text-muted-foreground mb-4">
      <div class="flex items-center justify-between">
        <div>
          <p>Products loaded: {{ products.length }}</p>
          <p>Pagination: Page {{ pagination?.current_page }} of {{ pagination?.last_page }}</p>
          <p>Total items: {{ pagination?.total }}</p>
        </div>
        <div class="flex items-center gap-2">
          <label for="per-page" class="text-sm font-medium">Items per page:</label>
          <Select 
            :model-value="pagination?.per_page.toString()" 
            @update:model-value="(value) => handlePerPageChange(Number(value))"
          >
            <SelectTrigger class="w-20">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in perPageOptions" :key="option" :value="option.toString()">
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <ProductTable
      :products="productsStore.products"
      :deleting-id="deletingId"
      @view="viewProduct"
      @edit="editProduct"
      @delete="handleDelete"
    />

    <div class="space-y-4">
      <Pagination :disabled="productsStore.loading" @goToPage="goToPage($event)" :total="pagination?.total" :current-page="pagination?.current_page" />

      <p class="text-center text-sm text-muted-foreground">
        Showing {{ productsStore.products.length }} of {{ pagination?.total }} items
      </p>
    </div>
    
    
  </div>

</template>
