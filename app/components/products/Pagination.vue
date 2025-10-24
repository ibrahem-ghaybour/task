<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

/**
 * Pagination Component
 * Reusable pagination controls with page navigation
 */

interface Props {
  /** Current active page */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Number of items currently displayed */
  displayedItems: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  changePage: [page: number];
}>();

/**
 * Navigate to specific page
 */
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("changePage", page);
  }
};

/**
 * Check if page number should be displayed
 * Shows first, last, current, and adjacent pages
 */
const shouldShowPage = (page: number): boolean => {
  return (
    page === 1 ||
    page === props.totalPages ||
    Math.abs(page - props.currentPage) <= 1
  );
};

/**
 * Check if ellipsis should be shown
 */
const shouldShowEllipsis = (page: number): boolean => {
  return (
    page === props.currentPage - 2 || page === props.currentPage + 2
  );
};
</script>

<template>
  <div v-if="totalPages > 1" class="space-y-4">
    <!-- Pagination Controls -->
    <div class="flex items-center justify-center gap-2">
      <!-- Previous Button -->
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <template v-for="page in totalPages" :key="page">
          <!-- Page Button -->
          <Button
            v-if="shouldShowPage(page)"
            :variant="page === currentPage ? 'default' : 'outline'"
            size="sm"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>

          <!-- Ellipsis -->
          <span v-else-if="shouldShowEllipsis(page)" class="px-2 text-muted-foreground">
            ...
          </span>
        </template>
      </div>

      <!-- Next Button -->
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>

    <!-- Pagination Info -->
    <p class="text-center text-sm text-muted-foreground">
      Showing {{ displayedItems }} of {{ totalItems }} items
    </p>
  </div>
</template>
