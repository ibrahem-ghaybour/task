<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Save, Loader2, Upload, X } from "lucide-vue-next";
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
import { useProducts } from "~/composables/useProducts";
import { useToast } from "~/composables/useToast";
import { productSchema } from "~/utils/validation";

// ✅ Form state
const router = useRouter();
const { createProduct } = useProducts();
const toast = useToast();
const catalog = useCatalog();

// ✅ Form validation
const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(productSchema),
  initialValues: {
    name: "",
    slug: "",
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
    online_units: 1,
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

// ✅ Define form fields
const [name] = defineField("name");
const [slug] = defineField("slug");
const [keywords_seo_ar] = defineField("keywords_seo_ar");
const [keywords_seo_en] = defineField("keywords_seo_en");
const [description_seo_ar] = defineField("description_seo_ar");
const [description_seo_en] = defineField("description_seo_en");
const [description] = defineField("description");
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
const [sku] = defineField("sku");
const [weight] = defineField("weight");
const [barcode] = defineField("barcode");
const [content] = defineField("content");
const [price] = defineField("price");
const [Item_Isdisabled] = defineField("Item_Isdisabled");

// ✅ Catalog data
const categories = ref<any[]>([]);
const brands = ref<any[]>([]);
const units = ref<any[]>([]);
const catalogLoading = ref(false);

// ✅ File upload
const selectedImages = ref<File[]>([]);
const imagePreviewUrls = ref<string[]>([]);

// ✅ Loading state
const isSubmitting = ref(false);

// ✅ Load catalog data
onMounted(async () => {
  catalogLoading.value = true;
  try {
    const [categoriesRes, brandsRes, unitsRes] = await Promise.all([
      catalog.fetchCategories(),
      catalog.fetchBrands(),
      catalog.fetchUnits(),
    ]);

    categories.value = categoriesRes?.data || [];
    brands.value = brandsRes?.data || [];
    units.value = unitsRes?.data || [];
  } catch (error) {
    console.error("Error loading catalog data:", error);
    toast.error("Failed to load catalog data");
  } finally {
    catalogLoading.value = false;
  }
});

// ✅ Handle image selection
const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    selectedImages.value = [...selectedImages.value, ...files];
    
    // Create preview URLs
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      imagePreviewUrls.value.push(url);
    });
  }
};

// ✅ Remove image
const removeImage = (index: number) => {
  selectedImages.value.splice(index, 1);
  const url = imagePreviewUrls.value[index];
  if (url) {
    URL.revokeObjectURL(url);
  }
  imagePreviewUrls.value.splice(index, 1);
};

// ✅ Handle form submission
const onSubmit = handleSubmit(async (formValues) => {
  isSubmitting.value = true;
  
  try {
    // Debug: Log form values to see what's being sent
    console.log("Form values being submitted:", formValues);
    
    // Create structured payload like ProductForm.vue
    const payload = {
      name: formValues.name,
      slug: formValues.slug || "",
      keywords_seo_ar: formValues.keywords_seo_ar || "",
      keywords_seo_en: formValues.keywords_seo_en || "",
      description_seo_ar: formValues.description_seo_ar || "",
      description_seo_en: formValues.description_seo_en || "",
      description: formValues.description || "",
      category: Number(formValues.category),
      brand: Number(formValues.brand),
      unit: Number(formValues.unit),
      quantity: Number(formValues.quantity),
      featured: Number(formValues.featured) as 0 | 1,
      isOnline: Number(formValues.isOnline) as 0 | 1,
      online_units: Number(formValues.online_units) || 1,
      max_order: Number(formValues.max_order),
      buying_price: Number(formValues.buying_price),
      selling_price: Number(formValues.selling_price),
      tax: Number(formValues.tax),
      sku: formValues.sku,
      weight: Number(formValues.weight),
      barcode: formValues.barcode || "",
      content: formValues.content || "",
      price: Number(formValues.price),
      Item_Isdisabled: Number(formValues.Item_Isdisabled),
    };
    
    console.log("Structured payload:", payload);
    console.log("online_units value:", payload.online_units);
    
    // Create FormData for file uploads
    const submitData = new FormData();
    
    // Add all payload fields to FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        submitData.append(key, value.toString());
        console.log(`Added field: ${key} = ${value}`);
      }
    });
    
    // Add images
    selectedImages.value.forEach((file, index) => {
      submitData.append(`images[${index}]`, file);
    });
    
    // Debug: Log all FormData entries
    console.log("FormData entries:");
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // Submit the form
    await createProduct(payload);
    
    toast.success("Product created successfully!");
    router.push("/products");
    
  } catch (error: any) {
    console.error("Error creating product:", error);
    toast.error(error.message || "Failed to create product");
  } finally {
    isSubmitting.value = false;
  }
});

</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Create New Product</h1>
      <Button @click="router.push('/products')" variant="outline">
        Back to Products
      </Button>
    </div>

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
                <Input 
                  v-model="name" 
                  placeholder="Enter product name" 
                  required 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="slug">
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input 
                  v-model="slug" 
                  placeholder="Enter URL slug" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  v-model="description"
                  class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter product description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="grid md:grid-cols-2 gap-4">
            <FormField name="keywords_seo_ar">
              <FormItem>
                <FormLabel>SEO Keywords (Arabic)</FormLabel>
                <FormControl>
                  <Input 
                    v-model="keywords_seo_ar" 
                    placeholder="Enter Arabic SEO keywords" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="keywords_seo_en">
              <FormItem>
                <FormLabel>SEO Keywords (English)</FormLabel>
                <FormControl>
                  <Input 
                    v-model="keywords_seo_en" 
                    placeholder="Enter English SEO keywords" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <FormField name="description_seo_ar">
              <FormItem>
                <FormLabel>SEO Description (Arabic)</FormLabel>
                <FormControl>
                  <Input 
                    v-model="description_seo_ar" 
                    placeholder="Enter Arabic SEO description" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="description_seo_en">
              <FormItem>
                <FormLabel>SEO Description (English)</FormLabel>
                <FormControl>
                  <Input 
                    v-model="description_seo_en" 
                    placeholder="Enter English SEO description" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
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
        <CardContent class="space-y-4">
          <FormField name="category">
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <FormControl>
                <Select 
                  :model-value="category" 
                  @update:model-value="(value) => category = Number(value)"
                  :disabled="catalogLoading"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      v-for="categoryItem in categories" 
                      :key="categoryItem?.id" 
                      :value="categoryItem?.id?.toString()"
                    >
                      {{ categoryItem?.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="brand">
            <FormItem>
              <FormLabel>Brand *</FormLabel>
              <FormControl>
                <Select 
                  :model-value="brand" 
                  @update:model-value="(value) => brand = Number(value)"
                  :disabled="catalogLoading"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      v-for="brandItem in brands" 
                      :key="brandItem?.id" 
                      :value="brandItem?.id?.toString()"
                    >
                      {{ brandItem?.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="unit">
            <FormItem>
              <FormLabel>Unit *</FormLabel>
              <FormControl>
                <Select 
                  :model-value="unit" 
                  @update:model-value="(value) => unit = Number(value)"
                  :disabled="catalogLoading"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      v-for="unitItem in units" 
                      :key="unitItem?.id" 
                      :value="unitItem?.id?.toString()"
                    >
                      {{ unitItem?.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Inventory -->
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <FormField name="sku">
            <FormItem>
              <FormLabel>SKU *</FormLabel>
              <FormControl>
                <Input 
                  v-model="sku" 
                  placeholder="Enter SKU" 
                  required 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="barcode">
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input 
                  v-model="barcode" 
                  placeholder="Enter barcode" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="grid md:grid-cols-3 gap-4">
            <FormField name="quantity">
              <FormItem>
                <FormLabel>Quantity *</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="quantity" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- <FormField name="online_units">
              <FormItem>
                <FormLabel>Online Units *</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="online_units" 
                    type="number" 
                    min="1" 
                    placeholder="1" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->

            <FormField name="max_order">
              <FormItem>
                <FormLabel>Max Order</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="max_order" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField name="weight">
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input 
                  v-model.number="weight" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="grid md:grid-cols-2 gap-4">
            <FormField name="featured">
              <FormItem>
                <FormLabel>Featured Product</FormLabel>
                <FormControl>
                  <div class="flex items-center gap-2">
                    <input 
                      id="featured" 
                      v-model.number="featured" 
                      type="checkbox" 
                      :true-value="1" 
                      :false-value="0" 
                    />
                    <label for="featured" class="text-sm font-medium cursor-pointer">
                      Mark as Featured
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="isOnline">
              <FormItem>
                <FormLabel>Online Availability</FormLabel>
                <FormControl>
                  <div class="flex items-center gap-2">
                    <input 
                      id="online" 
                      v-model.number="isOnline" 
                      type="checkbox" 
                      :true-value="1" 
                      :false-value="0" 
                    />
                    <label for="online" class="text-sm font-medium cursor-pointer">
                      Available Online
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </Card>

      <!-- Pricing -->
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid md:grid-cols-3 gap-4">
            <FormField name="buying_price">
              <FormItem>
                <FormLabel>Buying Price</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="buying_price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="selling_price">
              <FormItem>
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="selling_price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="price">
              <FormItem>
                <FormLabel>Final Price *</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00" 
                    required 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField name="tax">
            <FormItem>
              <FormLabel>Tax (%)</FormLabel>
              <FormControl>
                <Input 
                  v-model.number="tax" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="100" 
                  placeholder="0.00" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Images -->
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <FormField name="images">
            <FormItem>
              <FormLabel>Upload Images</FormLabel>
              <FormControl>
                <div class="space-y-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    @change="handleImageSelect"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  
                  <!-- Image Previews -->
                  <div v-if="imagePreviewUrls.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div 
                      v-for="(url, index) in imagePreviewUrls" 
                      :key="index"
                      class="relative group"
                    >
                      <img 
                        :src="url" 
                        :alt="`Preview ${index + 1}`"
                        class="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        @click="removeImage(index)"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Content -->
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <FormField name="content">
            <FormItem>
              <FormLabel>Rich Content</FormLabel>
              <FormControl>
                <textarea
                  v-model="content"
                  class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter rich content (HTML supported)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Status -->
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <FormField name="Item_Isdisabled">
            <FormItem>
              <FormLabel>Item Disabled Status</FormLabel>
              <FormControl>
                <Input 
                  v-model.number="Item_Isdisabled" 
                  type="number" 
                  min="0" 
                  max="1" 
                  placeholder="0 or 1" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
      </Card>

      <!-- Submit Button -->
      <div class="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          @click="router.push('/products')"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          :disabled="isSubmitting || catalogLoading"
        >
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          <Save v-else class="mr-2 h-4 w-4" />
          {{ isSubmitting ? 'Creating...' : 'Create Product' }}
        </Button>
      </div>
    </form>
  </div>
</template>
