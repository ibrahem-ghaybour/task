<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
 * Generate page numbers to display
 * Shows first, last, current, and adjacent pages with ellipsis
 */
const getPageNumbers = (): (number | 'ellipsis')[] => {
  const pages: (number | 'ellipsis')[] = [];
  const { currentPage, totalPages } = props;

  // Always show first page
  pages.push(1);

  // Add ellipsis if there's a gap after page 1
  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  // Add pages around current page
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i);
    }
  }

  // Add ellipsis if there's a gap before last page
  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  // Always show last page (if more than 1 page)
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};
</script>

<template>
  <div class="space-y-4">
    <!-- Debug info for pagination -->
    <div class="text-xs text-muted-foreground">
      Debug: totalPages={{ totalPages }}, currentPage={{ currentPage }}
    </div>
    
    <!-- Always show pagination for debugging -->
    <div v-if="totalPages > 1">
      <!-- Pagination Controls -->
      <Pagination>
        <PaginationContent>
          <!-- Previous Button -->
          <PaginationItem>
            <PaginationPrevious
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            />
          </PaginationItem>

          <!-- Page Numbers -->
          <template v-for="(page, index) in getPageNumbers()" :key="index">
            <PaginationItem v-if="page !== 'ellipsis'">
              <PaginationLink
                :is-active="page === currentPage"
                @click="goToPage(page as number)"
              >
                {{ page }}
              </PaginationLink>
            </PaginationItem>
            
            <PaginationItem v-else>
              <PaginationEllipsis />
            </PaginationItem>
          </template>

          <!-- Next Button -->
          <PaginationItem>
            <PaginationNext
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
    
    <!-- Show message when only 1 page -->
    <div v-else class="text-center text-sm text-muted-foreground">
      Only one page available
    </div>

    <!-- Pagination Info -->
    <p class="text-center text-sm text-muted-foreground">
      Showing {{ displayedItems }} of {{ totalItems }} items
    </p>
  </div>
</template>
