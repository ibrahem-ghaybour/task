<script setup lang="ts">
import AppSidebar from "~/components/layouts/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full p-7">
      <SidebarTrigger class="md:hidden" />
      <RouterView />
    </main>
  </SidebarProvider>
</template>
