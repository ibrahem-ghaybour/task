<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-vue-next";

interface Props {
  /** Whether the dialog is open */
  open?: boolean;
  /** Whether the deletion is in progress */
  loading?: boolean;
  /** Product name to display in confirmation */
  productName?: string;
  /** Product ID for identification */
  productId?: number;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  loading: false,
  productName: "",
  productId: 0,
});

const emit = defineEmits<{
  /** Emitted when dialog open state changes */
  "update:open": [open: boolean];
  /** Emitted when user confirms deletion */
  confirm: [id: number];
  /** Emitted when user cancels deletion */
  cancel: [];
}>();

/**
 * Handle confirmation of deletion
 */
const handleConfirm = () => {
  emit("confirm", props.productId);
};

/**
 * Handle cancellation of deletion
 */
const handleCancel = () => {
  emit("cancel");
  emit("update:open", false);
};

/**
 * Handle dialog open state change
 */
const handleOpenChange = (open: boolean) => {
  emit("update:open", open);
};
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle class="h-5 w-5 text-destructive" />
          </div>
          <div>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription class="mt-1">
              This action cannot be undone.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div class="py-4">
        <p class="text-sm text-muted-foreground">
          Are you sure you want to delete 
          <span v-if="productName" class="font-medium text-foreground">"{{ productName }}"</span>
          <span v-else class="font-medium text-foreground">this product</span>?
        </p>
        <p class="mt-2 text-sm text-muted-foreground">
          This will permanently remove the product and all its data from the system.
        </p>
      </div>

      <DialogFooter class="gap-2">
        <Button 
          variant="outline" 
          @click="handleCancel"
          :disabled="loading"
        >
          Cancel
        </Button>
        <Button 
          variant="destructive" 
          @click="handleConfirm"
          :disabled="loading"
        >
          <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          {{ loading ? "Deleting..." : "Delete Product" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
