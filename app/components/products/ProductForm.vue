<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
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
import { productSchema } from "~/utils/validation";

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

// ✅ Catalog data
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
        keywords_seo_ar: props.product.keywords_seo_ar || "",
        keywords_seo_en: props.product.keywords_seo_en || "",
        description_seo_ar: props.product.description_seo_ar || "",
        description_seo_en: props.product.description_seo_en || "",
        description: props.product.description || "",
        category: Number(props.product.category) || 0,
        brand: Number(props.product.brand) || 0,
        unit: Number(props.product.unit) || 0,
        quantity: Number(props.product.quantity) || 0,
        featured: (Number(props.product.featured) || 0) as 0 | 1,
        isOnline: (Number(props.product.isOnline) || 0) as 0 | 1,
        online_units: Number(props.product.online_units) || 0,
        max_order: Number(props.product.max_order) || 0,
        buying_price: Number(props.product.buying_price) || 0,
        selling_price: Number(props.product.selling_price) || 0,
        tax: Number(props.product.tax) || 0,
        sku: props.product.sku || "",
        weight: Number(props.product.weight) || 0,
        barcode: props.product.barcode || "",
        content: props.product.content || "",
        price: Number(props.product.price) || 0,
        Item_Isdisabled: Number(props.product.Item_Isdisabled) || 1,
      }
    : {
        name: "",
        keywords_seo_ar: "",
        keywords_seo_en: "",
        description_seo_ar: "",
        description_seo_en: "",
        description: "",
        category: 0,
        brand: 0,
        unit: 0,
        quantity: 0,
        featured: 0 as 0 | 1,
        isOnline: 0 as 0 | 1,
        online_units: 0,
        max_order: 0,
        buying_price: 0,
        selling_price: 0,
        tax: 0,
        sku: "",
        weight: 0,
        barcode: "",
        content: "",
        price: 0,
        Item_Isdisabled: 1,
      },
});

/* ✅ تعريف الحقول */
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
const [online_units] = defineField("online_units");
const [max_order] = defineField("max_order");
const [buying_price] = defineField("buying_price");
const [selling_price] = defineField("selling_price");
const [tax] = defineField("tax");
const [weight] = defineField("weight");
const [content] = defineField("content");
const [price] = defineField("price");
const [Item_Isdisabled] = defineField("Item_Isdisabled");

/* ✅ الإرسال */
const onSubmit = handleSubmit((formValues) => {
  const payload: CreateProductPayload = {
    name: formValues.name,
    keywords_seo_ar: formValues.keywords_seo_ar,
    keywords_seo_en: formValues.keywords_seo_en,
    description_seo_ar: formValues.description_seo_ar,
    description_seo_en: formValues.description_seo_en,
    description: formValues.description || "",
    category: Number(formValues.category),
    brand: Number(formValues.brand),
    unit: Number(formValues.unit),
    quantity: Number(formValues.quantity),
    featured: Number(formValues.featured) as 0 | 1,
    isOnline: Number(formValues.isOnline) as 0 | 1,
    online_units: Number(formValues.online_units),
    max_order: Number(formValues.max_order),
    buying_price: Number(formValues.buying_price),
    selling_price: Number(formValues.selling_price),
    tax: Number(formValues.tax),
    sku: formValues.sku,
    weight: Number(formValues.weight),
    barcode: formValues.barcode,
    content: formValues.content,
    price: Number(formValues.price),
    Item_Isdisabled: Number(formValues.Item_Isdisabled),
  };

  emit("submit", payload);
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
      <CardContent class="grid md:grid-cols-4 gap-4">
        <FormField name="buying_price">
          <FormItem>
            <FormLabel>Buying Price</FormLabel>
            <FormControl>
              <Input v-model.number="buying_price" type="number" step="0.01" placeholder="0.00" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="selling_price">
          <FormItem>
            <FormLabel>Selling Price</FormLabel>
            <FormControl>
              <Input v-model.number="selling_price" type="number" step="0.01" placeholder="0.00" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField name="price">
          <FormItem>
            <FormLabel>Final Price *</FormLabel>
            <FormControl>
              <Input v-model.number="price" type="number" step="0.01" placeholder="0.00" />
            </FormControl>
            <FormMessage v-if="errors.price">{{ errors.price }}</FormMessage>
          </FormItem>
        </FormField>


        <FormField name="tax">
          <FormItem>
            <FormLabel>Tax (%)</FormLabel>
            <FormControl>
              <Input v-model.number="tax" type="number" step="0.01" placeholder="0.00" />
            </FormControl>
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
                @update:model-value="(v) => (category = Number(v))"
                :disabled="catalogLoading"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id.toString()">
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
                @update:model-value="(v) => (brand = Number(v))"
                :disabled="catalogLoading"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="b in brands" :key="b.id" :value="b.id.toString()">
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
                @update:model-value="(v) => (unit = Number(v))"
                :disabled="catalogLoading"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="u in units" :key="u.id" :value="u.id.toString()">
                    {{ u.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Inventory -->
    <Card>
      <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
      <CardContent class="space-y-4">
        <FormField name="sku">
          <FormItem>
            <FormLabel>SKU *</FormLabel>
            <FormControl>
              <Input v-model="sku" placeholder="Enter SKU" />
            </FormControl>
            <FormMessage v-if="errors.sku">{{ errors.sku }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="barcode">
          <FormItem>
            <FormLabel>Barcode</FormLabel>
            <FormControl>
              <Input v-model="barcode" type="text" placeholder="Enter barcode" />
            </FormControl>
            <FormMessage v-if="errors.barcode">{{ errors.barcode }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="quantity">
          <FormItem>
            <FormLabel>Quantity *</FormLabel>
            <FormControl>
              <Input v-model.number="quantity" type="number" min="0" placeholder="Enter quantity" />
            </FormControl>
            <FormMessage v-if="errors.quantity">{{ errors.quantity }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="online_units">
          <FormItem>
            <FormLabel>Online Units *</FormLabel>
            <FormControl>
              <Input v-model.number="online_units" type="number" min="1" placeholder="Enter online units" />
            </FormControl>
            <FormMessage v-if="errors.online_units">{{ errors.online_units }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="max_order">
          <FormItem>
            <FormLabel>Max Order Quantity</FormLabel>
            <FormControl>
              <Input v-model.number="max_order" type="number" min="0" placeholder="Enter max order quantity" />
            </FormControl>
            <FormMessage v-if="errors.max_order">{{ errors.max_order }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField name="weight">
          <FormItem>
            <FormLabel>Weight (kg)</FormLabel>
            <FormControl>
              <Input v-model.number="weight" type="number" step="0.01" min="0" placeholder="Enter weight in kg" />
            </FormControl>
            <FormMessage v-if="errors.weight">{{ errors.weight }}</FormMessage>
          </FormItem>
        </FormField>

        <div class="grid md:grid-cols-2 gap-4">
          <FormField name="featured">
            <FormItem>
              <FormLabel>Featured Product</FormLabel>
              <FormControl>
                <div class="flex items-center gap-2">
                  <input id="featured" v-model="featured" type="checkbox" :true-value="1" :false-value="0" />
                  <label for="featured" class="text-sm font-medium cursor-pointer">Mark as Featured</label>
                </div>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="isOnline">
            <FormItem>
              <FormLabel>Online Availability</FormLabel>
              <FormControl>
                <div class="flex items-center gap-2">
                  <input id="online" v-model="isOnline" type="checkbox" :true-value="1" :false-value="0" />
                  <label for="online" class="text-sm font-medium cursor-pointer">Available Online</label>
                </div>
              </FormControl>
            </FormItem>
          </FormField>
        </div>
      </CardContent>
    </Card>

    <!-- Status -->
    <Card>
      <CardHeader><CardTitle>Status</CardTitle></CardHeader>
      <CardContent class="space-y-4">


        <FormField name="Item_Isdisabled">
          <FormItem>
            <FormLabel>Item Disabled Status</FormLabel>
            <FormControl>
              <Input v-model.number="Item_Isdisabled" type="number" min="0" max="1" placeholder="0 or 1" />
            </FormControl>
            <FormMessage v-if="errors.Item_Isdisabled">{{ errors.Item_Isdisabled }}</FormMessage>
          </FormItem>
        </FormField>

      </CardContent>
    </Card>

    <!-- Extra content -->
    <Card>
      <CardHeader><CardTitle>Extra Content</CardTitle></CardHeader>
      <CardContent>
        <FormField name="content">
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <textarea
                v-model="content"
                placeholder="Extra product info..."
                class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </CardContent>
    </Card>

    <!-- Actions -->
    <div class="flex gap-4">
      <Button type="submit" :disabled="loading || catalogLoading" size="lg">
        <Loader2 v-if="loading || catalogLoading" class="mr-2 h-4 w-4 animate-spin" />
        <Save v-else class="mr-2 h-4 w-4" />
        {{ loading ? "Saving..." : catalogLoading ? "Loading..." : submitText }}
      </Button>
      <Button type="button" variant="outline" @click="handleCancel" size="lg">
        Cancel
      </Button>
    </div>
  </form>
</template>
