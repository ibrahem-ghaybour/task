<script setup lang="ts">
import Login from "@/components/auth/Login.vue";

definePageMeta({
  layout: false,
});
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
    <div class="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
    
    <div class="relative z-10">
      <Login />
    </div>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, currentColor 1px, transparent 1px),
    linear-gradient(to bottom, currentColor 1px, transparent 1px);
  background-size: 40px 40px;
}
</style>