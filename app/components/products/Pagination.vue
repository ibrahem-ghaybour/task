<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
const Props = defineProps({
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
  defaultPage: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['goToPage'])
const goToPage = (page: number) => emit('goToPage', page)
</script>

<template>
  <Pagination v-slot="{ page }" :items-per-page="Props.itemsPerPage" :total="Props.total" :default-page="Props.defaultPage">
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious />

      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          @click="goToPage(item.value)"
          :value="item.value"
          :is-active="item.value === page"
          :disabled="Props.disabled"
        >
          {{ item.value }}
        </PaginationItem>
      </template>

      <PaginationEllipsis :index="4" />

      <PaginationNext />
    </PaginationContent>
  </Pagination>
</template>