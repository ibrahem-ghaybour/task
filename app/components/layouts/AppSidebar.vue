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

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);
const router = useRouter();

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


const handleLogout = async () => {
    await authStore.logout();
};


const userInitials = computed(() => {
  return "U";
});

</script>

<template>
  <Sidebar >
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

    <SidebarFooter class="border-t p-4">
      <div v-if="authStore.isAuthenticated" class="space-y-3">
        <div class="flex items-center gap-3">
          <Avatar>
            <AvatarFallback class="bg-primary text-primary-foreground">
              {{ userInitials }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-medium truncate">
              {{ currentUser?.username || 'Guest' }}
            </p>
            <p class="text-xs text-muted-foreground truncate">
              {{ currentUser?.email || 'No email' }}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          class="w-full"
          :disabled="authStore.loading"
          @click="handleLogout"
        >
          <LogOut class="mr-2 h-4 w-4" />
          {{ authStore.loading ? "Logging out..." : "Logout" }}
        </Button>
      </div>

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