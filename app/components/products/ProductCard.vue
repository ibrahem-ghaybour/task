<script setup lang="ts">
import type { Product } from "~/types/product";
import { Eye, Trash2, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * ProductCard Component
 * Displays product information in a card format
 * Includes view and delete actions
 */

interface Props {
  /** Product data to display */
  product: Product;
  /** Loading state for delete operation */
  isDeleting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDeleting: false,
});

const emit = defineEmits<{
  view: [id: number];
  delete: [id: number];
}>();

/**
 * Emit view event
 */
const handleView = () => {
  emit("view", props.product.id);
};

/**
 * Emit delete event
 */
const handleDelete = () => {
  emit("delete", props.product.id);
};
</script>

<template>
  <Card class="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <CardTitle class="line-clamp-1">{{ product.name }}</CardTitle>
          <CardDescription class="mt-1">SKU: {{ product.sku }}</CardDescription>
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
            @click="handleView"
          >
            <Eye class="mr-2 h-4 w-4" />
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            :disabled="isDeleting"
            @click="handleDelete"
          >
            <Loader2 v-if="isDeleting" class="h-4 w-4 animate-spin" />
            <Trash2 v-else class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
