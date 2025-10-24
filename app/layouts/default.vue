/**
 * Default Layout
 * Main application layout with sidebar navigation
 */
<script setup lang="ts">
import AppSidebar from "~/components/layouts/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <h1 class="text-lg font-semibold">Product Manager</h1>
      </header>
      
      <main class="flex-1 overflow-auto">
        <div class="p-4 md:p-6 lg:p-8">
          <slot />
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
