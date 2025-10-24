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

const authStore = useAuthStore();
const toastNotification = useToast();
const router = useRouter();

const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { username: "", password: "", provider: "mgr", otp: "" },
});

const onSubmit = handleSubmit(async (values) => {
  await authStore.login(values);
  router.push("/");
});
</script>

<template>
  <Card class="w-full max-w-lg">
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
          :disabled="authStore.loading"
          size="lg"
        >
          <Loader2 v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
          <LogIn v-else class="mr-2 h-4 w-4" />
          {{ authStore.loading ? "Signing in..." : "Sign In" }}
        </Button>
      </CardContent>
    </form>
  </Card>
</template>
