<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { productSchema } from "~/utils/validation";
import type { Product, CreateProductPayload } from "~/types/product";
import { Save, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

/**
 * ProductForm Component
 * Reusable form for creating and editing products
 * Includes validation, loading states, and proper error handling
 */

interface Props {
  /** Existing product data for edit mode */
  product?: Product | null;
  /** Loading state from parent */
  loading?: boolean;
  /** Submit button text */
  submitText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  product: null,
  loading: false,
  submitText: "Save Product",
});

const emit = defineEmits<{
  submit: [payload: CreateProductPayload];
  cancel: [];
}>();

// Initialize form with validation
const { handleSubmit, defineField, errors, values } = useForm({
  validationSchema: toTypedSchema(productSchema),
  initialValues: props.product
    ? {
        name: props.product.name,
        sku: props.product.sku,
        description: props.product.description || "",
        keywords_seo_ar: props.product.keywords_seo_ar || "",
        keywords_seo_en: props.product.keywords_seo_en || "",
        description_seo_ar: props.product.description_seo_ar || "",
        description_seo_en: props.product.description_seo_en || "",
        category: props.product.category,
        brand: props.product.brand,
        unit: props.product.unit,
        quantity: props.product.quantity,
        featured: props.product.featured,
        isOnline: props.product.isOnline,
        online_units: props.product.online_units,
        max_order: props.product.max_order,
        buying_price: props.product.buying_price,
        selling_price: props.product.selling_price,
        tax: props.product.tax,
      }
    : {
        name: "",
        sku: "",
        description: "",
        keywords_seo_ar: "",
        keywords_seo_en: "",
        description_seo_ar: "",
        description_seo_en: "",
        category: 0,
        brand: 0,
        unit: 0,
        quantity: 0,
        featured: 0 as 0 | 1,
        isOnline: 0 as 0 | 1,
        online_units: 1,
        max_order: 0,
        buying_price: 0,
        selling_price: 0,
        tax: 0,
      },
});

// Define form fields
const [name] = defineField("name");
const [sku] = defineField("sku");
const [description] = defineField("description");
const [keywords_seo_ar] = defineField("keywords_seo_ar");
const [keywords_seo_en] = defineField("keywords_seo_en");
const [description_seo_ar] = defineField("description_seo_ar");
const [description_seo_en] = defineField("description_seo_en");
const [category] = defineField("category");
const [brand] = defineField("brand");
const [unit] = defineField("unit");
const [quantity] = defineField("quantity");
const [featured] = defineField("featured");
const [isOnline] = defineField("isOnline");
const [online_units] = defineField("online_units");
const [max_order] = defineField("max_order");
const [buying_price] = defineField("buying_price");
const [selling_price] = defineField("selling_price");
const [tax] = defineField("tax");

/**
 * Handle form submission
 * Validates and emits data to parent
 */
const onSubmit = handleSubmit((formValues) => {
  emit("submit", formValues as CreateProductPayload);
});

/**
 * Handle cancel action
 */
const handleCancel = () => {
  emit("cancel");
};
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <!-- Basic Information -->
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <FormField name="name">
          <FormItem>
            <FormLabel>Product Name *</FormLabel>
            <FormControl>
              <Input v-model="name" placeholder="Enter product name" />
            </FormControl>
            <FormMessage v-if="errors.name">{{ errors.name }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="sku">
          <FormItem>
            <FormLabel>SKU *</FormLabel>
            <FormControl>
              <Input v-model="sku" placeholder="e.g., PROD-001" />
            </FormControl>
            <FormMessage v-if="errors.sku">{{ errors.sku }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <textarea
                v-model="description"
                placeholder="Enter product description"
                class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </FormControl>
            <FormMessage v-if="errors.description">{{ errors.description }}</FormMessage>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Pricing -->
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent class="grid md:grid-cols-3 gap-4">
        <FormField name="buying_price">
          <FormItem>
            <FormLabel>Buying Price</FormLabel>
            <FormControl>
              <Input v-model.number="buying_price" type="number" step="0.01" placeholder="0.00" />
            </FormControl>
            <FormMessage v-if="errors.buying_price">{{ errors.buying_price }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="selling_price">
          <FormItem>
            <FormLabel>Selling Price *</FormLabel>
            <FormControl>
              <Input v-model.number="selling_price" type="number" step="0.01" placeholder="0.00" />
            </FormControl>
            <FormMessage v-if="errors.selling_price">{{ errors.selling_price }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="tax">
          <FormItem>
            <FormLabel>Tax (%)</FormLabel>
            <FormControl>
              <Input v-model.number="tax" type="number" step="0.01" placeholder="0" />
            </FormControl>
            <FormMessage v-if="errors.tax">{{ errors.tax }}</FormMessage>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Inventory -->
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent class="grid md:grid-cols-3 gap-4">
        <FormField name="quantity">
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input v-model.number="quantity" type="number" placeholder="0" />
            </FormControl>
            <FormMessage v-if="errors.quantity">{{ errors.quantity }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="online_units">
          <FormItem>
            <FormLabel>Online Units</FormLabel>
            <FormControl>
              <Input v-model.number="online_units" type="number" placeholder="1" />
            </FormControl>
            <FormMessage v-if="errors.online_units">{{ errors.online_units }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="max_order">
          <FormItem>
            <FormLabel>Max Order</FormLabel>
            <FormControl>
              <Input v-model.number="max_order" type="number" placeholder="0 (unlimited)" />
            </FormControl>
            <FormMessage v-if="errors.max_order">{{ errors.max_order }}</FormMessage>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Classification -->
    <Card>
      <CardHeader>
        <CardTitle>Classification</CardTitle>
      </CardHeader>
      <CardContent class="grid md:grid-cols-3 gap-4">
        <FormField name="category">
          <FormItem>
            <FormLabel>Category ID *</FormLabel>
            <FormControl>
              <Input v-model.number="category" type="number" placeholder="Enter category ID" />
            </FormControl>
            <FormMessage v-if="errors.category">{{ errors.category }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="brand">
          <FormItem>
            <FormLabel>Brand ID *</FormLabel>
            <FormControl>
              <Input v-model.number="brand" type="number" placeholder="Enter brand ID" />
            </FormControl>
            <FormMessage v-if="errors.brand">{{ errors.brand }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="unit">
          <FormItem>
            <FormLabel>Unit ID *</FormLabel>
            <FormControl>
              <Input v-model.number="unit" type="number" placeholder="Enter unit ID" />
            </FormControl>
            <FormMessage v-if="errors.unit">{{ errors.unit }}</FormMessage>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- SEO (Optional) -->
    <Card>
      <CardHeader>
        <CardTitle>SEO (Optional)</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <FormField name="keywords_seo_ar">
            <FormItem>
              <FormLabel>Keywords (Arabic)</FormLabel>
              <FormControl>
                <Input v-model="keywords_seo_ar" placeholder="كلمات مفتاحية" />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="keywords_seo_en">
            <FormItem>
              <FormLabel>Keywords (English)</FormLabel>
              <FormControl>
                <Input v-model="keywords_seo_en" placeholder="SEO keywords" />
              </FormControl>
            </FormItem>
          </FormField>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <FormField name="description_seo_ar">
            <FormItem>
              <FormLabel>Description (Arabic)</FormLabel>
              <FormControl>
                <Input v-model="description_seo_ar" placeholder="وصف SEO" />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="description_seo_en">
            <FormItem>
              <FormLabel>Description (English)</FormLabel>
              <FormControl>
                <Input v-model="description_seo_en" placeholder="SEO description" />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
      </CardContent>
    </Card>

    <!-- Status -->
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-2">
          <input
            id="featured"
            v-model="featured"
            type="checkbox"
            :true-value="1"
            :false-value="0"
            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
          />
          <label for="featured" class="text-sm font-medium cursor-pointer">
            Featured Product
          </label>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="online"
            v-model="isOnline"
            type="checkbox"
            :true-value="1"
            :false-value="0"
            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
          />
          <label for="online" class="text-sm font-medium cursor-pointer">
            Available Online
          </label>
        </div>
      </CardContent>
    </Card>

    <!-- Form Actions -->
    <div class="flex gap-4">
      <Button type="submit" :disabled="loading" size="lg">
        <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
        <Save v-else class="mr-2 h-4 w-4" />
        {{ loading ? "Saving..." : submitText }}
      </Button>
      <Button type="button" variant="outline" @click="handleCancel" size="lg">
        Cancel
      </Button>
    </div>
  </form>
</template>
