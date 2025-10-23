<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { Package, LogIn, LogOut } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const authStore = useAuthStore();
const router = useRouter();

const goToProducts = () => router.push("/products");
const goToLogin = () => router.push("/auth/login");
const handleLogout = async () => {
  await authStore.logout();
  router.push("/auth/login");
};
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Welcome to Product Manager
      </h1>
      <p class="text-xl text-muted-foreground">
        Manage your products efficiently with our modern dashboard
      </p>
    </div>

    <!-- Auth Status -->
    <div class="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>
              {{ authStore.isAuthenticated ? 'You are logged in' : 'Please log in to continue' }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="authStore.isAuthenticated" class="space-y-4">
              <div v-if="authStore.currentUser" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm font-medium text-green-900">
                  Logged in as: {{ authStore.currentUser.name }}
                </p>
                <p class="text-sm text-green-700">{{ authStore.currentUser.email }}</p>
              </div>
              <div class="flex gap-4">
                <Button @click="goToProducts" size="lg" class="flex-1">
                  <Package class="mr-2 h-5 w-5" />
                  Go to Products
                </Button>
                <Button @click="handleLogout" variant="outline" size="lg">
                  <LogOut class="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
            <div v-else>
              <Button @click="goToLogin" size="lg" class="w-full">
                <LogIn class="mr-2 h-5 w-5" />
                Login to Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Package class="h-5 w-5 text-blue-600" />
              Product Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              Create, view, update, and delete products with ease
            </p>
          </CardContent>
        </Card>

        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Inventory Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              Keep track of stock levels and product availability
            </p>
          </CardContent>
        </Card>

        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pricing Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              Set buying and selling prices with tax calculations
            </p>
          </CardContent>
        </Card>
    </div>
  </div>
</template>
