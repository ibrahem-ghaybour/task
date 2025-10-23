<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
</script>
<template>
  <div id="app">
    <div class="bg-background">
      <nuxt-layout>
        <nuxt-page />
      </nuxt-layout>
      <Toaster class="pointer-events-auto" />
    </div>
  </div>
</template>

