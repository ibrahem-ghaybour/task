<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const props = defineProps({
  itemsPerPage: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  defaultPage: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['goToPage'])
const goToPage = (page: number) => emit('goToPage', page)
</script>

<template>
  <Pagination
    v-slot="{ page }"
    :items-per-page="props.itemsPerPage"
    :total="props.total"
    :default-page="props.defaultPage"
  >
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious :disabled="props.disabled" />

      <template v-for="item in items" :key="item">
        <PaginationItem
          v-if="item.type === 'page'"
          @click="goToPage(item.value)"
          :is-active="item.value === page"
          :value="item.value"
          :disabled="props.disabled"
        >
          {{ String(item.value) }}
        </PaginationItem>
      </template>

      <PaginationEllipsis />

      <PaginationNext :disabled="props.disabled" />
    </PaginationContent>
  </Pagination>
</template>
