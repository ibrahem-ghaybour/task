<script setup lang="ts">
import type { Product } from "~/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Eye, Pencil, Trash2 } from "lucide-vue-next";

interface Props {
  products: Product[];
  deletingId?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
  deletingId: null,
});

const emit = defineEmits<{
  view: [id: number];
  edit: [id: number];
  delete: [id: number];
}>();

const showDeleteDialog = ref(false);
const productToDelete = ref<Product | null>(null);


const handleDeleteClick = (product: Product) => {
  productToDelete.value = product;
  showDeleteDialog.value = true;
};

const handleConfirmDelete = () => {
  if (productToDelete.value) {
    emit("delete", productToDelete.value.id);
    showDeleteDialog.value = false;
    productToDelete.value = null;
  }
};


const handleCancelDelete = () => {
  showDeleteDialog.value = false;
  productToDelete.value = null;
};

watch(() => props.products, (newProducts) => {
  console.log('ProductTable received products:', newProducts);
  console.log('Products count:', newProducts.length);
  if (newProducts.length > 0) {
    console.log('First product:', newProducts[0]);
  }
}, { immediate: true });
</script>

<template>
  <Card>
    <CardContent class="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Online</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="!products.length">
            <TableCell colspan="7" class="text-center text-muted-foreground">
              No products found.
            </TableCell>
          </TableRow>
          <TableRow v-for="p in products" :key="p.id">
            <TableCell>{{ p.id }}</TableCell>
            <TableCell>{{ p.name }}</TableCell>
            <TableCell>{{ p.sku }}</TableCell>
            <TableCell>{{ p.category?.name }}</TableCell>
            <TableCell>{{ p.item_balance }}</TableCell>
            <TableCell>
              <span class="inline-flex h-6 items-center rounded px-2 text-xs" :class="p.isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'">
                {{ p.isOnline ? 'Yes' : 'No' }}
              </span>
            </TableCell>
            <TableCell>
              <div class="flex justify-end gap-2">
                <Button size="sm" variant="outline" @click="$emit('view', p.id)">
                  <Eye class="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" @click="$emit('edit', p.id)">
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  :disabled="deletingId === p.id" 
                  @click="handleDeleteClick(p)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  <ConfirmationDialog
    :open="showDeleteDialog"
    :loading="deletingId === productToDelete?.id"
    :product-name="productToDelete?.name"
    :product-id="productToDelete?.id"
    @update:open="showDeleteDialog = $event"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
