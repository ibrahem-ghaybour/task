/**
 * App Sidebar Component
 * Main navigation sidebar with user info and menu items
 */
<script setup lang="ts">
import { Package, Home, Plus, LogOut, User, ShoppingCart } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Composables
const auth = useAuth();
const toastNotification = useToast();
const router = useRouter();

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Add Product",
    url: "/products/create",
    icon: Plus,
  },
];

/**
 * Handle user logout
 */
const handleLogout = async () => {
  try {
    await auth.logout();
    toastNotification.success("Logged out successfully");
  } catch (error: any) {
    toastNotification.error("Logout failed", error.message);
  }
};

/**
 * Get user initials for avatar
 */
const userInitials = computed(() => {
  if (!auth.currentUser.value?.name) return "U";
  return auth.currentUser.value.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});
</script>

<template>
  <Sidebar>
    <!-- Header with Logo -->
    <SidebarHeader class="border-b p-4">
      <div class="flex items-center gap-2">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShoppingCart class="h-6 w-6" />
        </div>
        <div>
          <h2 class="text-lg font-semibold">Product Manager</h2>
          <p class="text-xs text-muted-foreground">Inventory System</p>
        </div>
      </div>
    </SidebarHeader>

    <!-- Navigation Menu -->
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton asChild>
                <NuxtLink :to="item.url" class="flex items-center gap-2">
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- Footer with User Info -->
    <SidebarFooter class="border-t p-4">
      <div v-if="auth.isAuthenticated.value" class="space-y-3">
        <!-- User Info -->
        <div class="flex items-center gap-3">
          <Avatar>
            <AvatarFallback class="bg-primary text-primary-foreground">
              {{ userInitials }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-medium truncate">
              {{ auth.currentUser.value?.name || "User" }}
            </p>
            <p class="text-xs text-muted-foreground truncate">
              {{ auth.currentUser.value?.email || "" }}
            </p>
          </div>
        </div>

        <!-- Logout Button -->
        <Button
          variant="outline"
          size="sm"
          class="w-full"
          :disabled="auth.loading.value"
          @click="handleLogout"
        >
          <LogOut class="mr-2 h-4 w-4" />
          {{ auth.loading.value ? "Logging out..." : "Logout" }}
        </Button>
      </div>

      <!-- Login Prompt -->
      <div v-else class="text-center">
        <p class="text-sm text-muted-foreground mb-2">Not logged in</p>
        <Button
          variant="default"
          size="sm"
          class="w-full"
          @click="router.push('/auth/login')"
        >
          <User class="mr-2 h-4 w-4" />
          Login
        </Button>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>