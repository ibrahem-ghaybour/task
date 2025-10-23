/**
 * Login Component
 * Handles user authentication with form validation and error handling
 */
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { loginSchema } from "~/utils/validation";
import { Loader2, User, Lock, LogIn, Shield } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Composables
const auth = useAuth();
const toastNotification = useToast();
const router = useRouter();

// Form setup with centralized validation schema
const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { username: "", password: "", provider: "mgr", otp: "" },
});

// Error state for displaying API errors
const errorMessage = ref<string | null>(null);

/**
 * Handle form submission
 * Attempts to log in user and redirects on success
 */
const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = null;
  
  try {
    await auth.login(values);
    
    // Show success notification
    toastNotification.success("Login successful!", "Welcome back to your dashboard");
    
    // Redirect to home page
    await router.push("/");
  } catch (error: any) {
    // Display error message
    errorMessage.value = error?.message || "Login failed. Please try again.";
    toastNotification.error("Login Failed", errorMessage.value || undefined);
  }
});
</script>

<template>
  <Card class="w-full max-w-md">
    <CardHeader class="space-y-1">
      <CardTitle class="text-3xl font-bold text-center">
        Welcome Back
      </CardTitle>
      <CardDescription class="text-center">
        Enter your credentials to access your account
      </CardDescription>
    </CardHeader>

    <form @submit.prevent="onSubmit">
      <CardContent class="space-y-4">
        <!-- Error Alert - Displays API errors -->
        <div
          v-if="errorMessage"
          class="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
        >
          {{ errorMessage }}
        </div>

        <!-- Username Field - Required for authentication -->
        <FormField
          v-slot="{ componentField }"
          name="username"
          :validate-on-blur="!isFieldDirty('username')"
        >
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <div class="relative">
                <User
                  class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="admin"
                  autocomplete="username"
                  class="pl-10"
                  v-bind="componentField"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Provider Field - Authentication provider (default: mgr) -->
        <FormField
          v-slot="{ componentField }"
          name="provider"
          :validate-on-blur="!isFieldDirty('provider')"
        >
          <FormItem>
            <FormLabel>Provider</FormLabel>
            <FormControl>
              <div class="relative">
                <Shield
                  class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="mgr"
                  class="pl-10"
                  v-bind="componentField"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Password Field - User password with forgot password link -->
        <FormField
          v-slot="{ componentField }"
          name="password"
          :validate-on-blur="!isFieldDirty('password')"
        >
          <FormItem>
            <div class="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <NuxtLink
                to="/auth/forgot-password"
                class="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </NuxtLink>
            </div>
            <FormControl>
              <div class="relative">
                <Lock
                  class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  type="password"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  class="pl-10"
                  v-bind="componentField"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- OTP Field - Optional two-factor authentication code -->
        <FormField
          v-slot="{ componentField }"
          name="otp"
          :validate-on-blur="!isFieldDirty('otp')"
        >
          <FormItem>
            <FormLabel>OTP (Optional)</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Leave empty if not required"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Submit Button - Shows loading state during authentication -->
        <Button
          type="submit"
          class="w-full"
:disabled="auth.loading.value"
          size="lg"
        >
<Loader2 v-if="auth.loading.value" class="mr-2 h-4 w-4 animate-spin" />
          <LogIn v-else class="mr-2 h-4 w-4" />
          {{ auth.loading.value ? "Signing in..." : "Sign In" }}
        </Button>
      </CardContent>

      <CardFooter class="flex flex-col space-y-4">
        <div class="relative w-full">
          <div class="absolute inset-0 flex items-center">
            <Separator class="w-full" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-card px-2 text-muted-foreground">
              Don't have an account?
            </span>
          </div>
        </div>
      </CardFooter>
    </form>
  </Card>
</template>
