<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { productSchema } from "~/utils/validation";
import type { Product, CreateProductPayload } from "~/types/product";
import { Save, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalog } from "~/composables/useCatalog";

interface Props {
  product?: Product | null;
  loading?: boolean;
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

// Catalog data
const catalog = useCatalog();
const categories = ref<any[]>([]);
const brands = ref<any[]>([]);
const units = ref<any[]>([]);
const catalogLoading = ref(false);

onMounted(async () => {
  catalogLoading.value = true;
  try {
    const [categoriesRes, brandsRes, unitsRes] = await Promise.all([
      catalog.fetchCategories(),
      catalog.fetchBrands(),
      catalog.fetchUnits(),
    ]);

    categories.value = categoriesRes.data || [];
    brands.value = brandsRes.data || [];
    units.value = unitsRes.data || [];
  } catch (error) {
    console.error("Error loading catalog data:", error);
  } finally {
    catalogLoading.value = false;
  }
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(productSchema),
  initialValues: props.product
    ? {
        name: props.product.name,
        sku: props.product.sku,
        barcode: props.product.barcode || "",
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
        item_isdisabled: props.product.item_isdisabled || 0,
        online_units: props.product.online_units || 1,
        max_order: props.product.max_order,
        buying_price: props.product.buying_price,
        selling_price: props.product.selling_price,
        // ✅ إصلاح هنا: تنظيف رمز % وتحويل القيمة إلى رقم
        tax:
          typeof props.product.tax === "string"
            ? parseFloat(props.product.tax.replace("%", "").trim()) || 0
            : props.product.tax || 0,
        weight: props.product.weight || 0,
      }
    : {
        name: "",
        sku: "",
        barcode: "",
        description: "",
        keywords_seo_ar: "",
        keywords_seo_en: "",
        description_seo_ar: "",
        description_seo_en: "",
        category: 0,
        brand: 0,
        unit: 0,
        quantity: 0,
        featured: 0,
        isOnline: 0,
        item_isdisabled: 0,
        online_units: 1,
        max_order: 0,
        buying_price: 0,
        selling_price: 0,
        tax: 0,
        weight: 0,
      },
});

// ✅ Define fields
const [name] = defineField("name");
const [sku] = defineField("sku");
const [barcode] = defineField("barcode");
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
const [item_isdisabled] = defineField("item_isdisabled");
const [online_units] = defineField("online_units");
const [max_order] = defineField("max_order");
const [buying_price] = defineField("buying_price");
const [selling_price] = defineField("selling_price");
const [tax] = defineField("tax");
const [weight] = defineField("weight");

// ✅ Submit
const onSubmit = handleSubmit((formValues) => {
  // تأكد من أن tax رقم
  formValues.tax = Number(formValues.tax) || 0;

  const payload = {
    ...formValues,
    price: formValues.selling_price,
    Item_Isdisabled: formValues.item_isdisabled,
  };

  delete payload.selling_price;
  delete payload.item_isdisabled;

  emit("submit", payload as CreateProductPayload);
});

const handleCancel = () => emit("cancel");
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <!-- Basic Information -->
    <Card>
      <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
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

        <FormField name="barcode">
          <FormItem>
            <FormLabel>Barcode *</FormLabel>
            <FormControl>
              <Input v-model="barcode" placeholder="Enter barcode" />
            </FormControl>
            <FormMessage v-if="errors.barcode">{{ errors.barcode }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <textarea
                v-model="description"
                placeholder="Enter product description"
                class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Pricing -->
    <Card>
      <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
      <CardContent class="grid md:grid-cols-3 gap-4">
        <FormField name="buying_price">
          <FormItem>
            <FormLabel>Buying Price</FormLabel>
            <FormControl>
              <Input
                v-model.number="buying_price"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="selling_price">
          <FormItem>
            <FormLabel>Selling Price *</FormLabel>
            <FormControl>
              <Input
                v-model.number="selling_price"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </FormControl>
            <FormMessage v-if="errors.selling_price">
              {{ errors.selling_price }}
            </FormMessage>
          </FormItem>
        </FormField>

        <FormField name="tax">
          <FormItem>
            <FormLabel>Tax (%)</FormLabel>
            <FormControl>
              <Input
                v-model.number="tax"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Inventory -->
    <Card>
      <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
      <CardContent class="grid md:grid-cols-3 gap-4">
        <FormField name="quantity">
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input v-model.number="quantity" type="number" placeholder="0" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="online_units">
          <FormItem>
            <FormLabel>Online Units *</FormLabel>
            <FormControl>
              <Input
                v-model.number="online_units"
                type="number"
                placeholder="1"
              />
            </FormControl>
            <FormMessage v-if="errors.online_units">
              {{ errors.online_units }}
            </FormMessage>
          </FormItem>
        </FormField>

        <FormField name="max_order">
          <FormItem>
            <FormLabel>Max Order</FormLabel>
            <FormControl>
              <Input
                v-model.number="max_order"
                type="number"
                placeholder="0 (unlimited)"
              />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="weight">
          <FormItem>
            <FormLabel>Weight *</FormLabel>
            <FormControl>
              <Input
                v-model.number="weight"
                type="number"
                step="0.01"
                placeholder="e.g., 0.5"
              />
            </FormControl>
            <FormMessage v-if="errors.weight">{{ errors.weight }}</FormMessage>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Classification -->
    <Card>
      <CardHeader>
        <CardTitle>Classification</CardTitle>
        <div v-if="catalogLoading" class="text-sm text-muted-foreground">
          Loading catalog data...
        </div>
      </CardHeader>
      <CardContent class="grid md:grid-cols-3 gap-4">
        <FormField name="category">
          <FormItem>
            <FormLabel>Category *</FormLabel>
            <FormControl>
              <Select
                :model-value="category?.toString()"
                @update:model-value="(value) => (category = Number(value))"
                :disabled="catalogLoading"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.id.toString()"
                  >
                    {{ cat.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="brand">
          <FormItem>
            <FormLabel>Brand *</FormLabel>
            <FormControl>
              <Select
                :model-value="brand?.toString()"
                @update:model-value="(value) => (brand = Number(value))"
                :disabled="catalogLoading"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="b in brands"
                    :key="b.id"
                    :value="b.id.toString()"
                  >
                    {{ b.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="unit">
          <FormItem>
            <FormLabel>Unit *</FormLabel>
            <FormControl>
              <Select
                :model-value="unit?.toString()"
                @update:model-value="(value) => (unit = Number(value))"
                :disabled="catalogLoading"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="u in units"
                    :key="u.id"
                    :value="u.id.toString()"
                  >
                    {{ u.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Status -->
    <Card>
      <CardHeader><CardTitle>Status</CardTitle></CardHeader>
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

        <div class="flex items-center gap-2">
          <input
            id="isdisabled"
            v-model="item_isdisabled"
            type="checkbox"
            :true-value="1"
            :false-value="0"
            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
          />
          <label for="isdisabled" class="text-sm font-medium cursor-pointer">
            Disabled
          </label>
        </div>
      </CardContent>
    </Card>

    <!-- Actions -->
    <div class="flex gap-4">
      <Button type="submit" :disabled="loading || catalogLoading" size="lg">
        <Loader2
          v-if="loading || catalogLoading"
          class="mr-2 h-4 w-4 animate-spin"
        />
        <Save v-else class="mr-2 h-4 w-4" />
        {{ loading ? "Saving..." : catalogLoading ? "Loading..." : submitText }}
      </Button>
      <Button type="button" variant="outline" @click="handleCancel" size="lg">
        Cancel
      </Button>
    </div>
  </form>
</template>
