<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
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

// ✅ Form state
const router = useRouter();
const { createProduct } = useProducts();
const toast = useToast();
const catalog = useCatalog();

// ✅ Form data
const formData = ref({
  name: "",
  slug: "",
  keywords_seo_ar: "",
  keywords_seo_en: "",
  description_seo_ar: "",
  description_seo_en: "",
  description: "",
  category: "",
  brand: "",
  unit: "",
  quantity: 0,
  featured: 0,
  isOnline: 0,
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
  item_isdisabled: 1,
});

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

    categories.value = categoriesRes.data || [];
    brands.value = brandsRes.data || [];
    units.value = unitsRes.data || [];
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
const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    // Create FormData
    const submitData = new FormData();
    
    // Add all form fields
    Object.entries(formData.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        submitData.append(key, value.toString());
      }
    });
    
    // Add images
    selectedImages.value.forEach((file, index) => {
      submitData.append(`images[${index}]`, file);
    });
    
    // Submit the form
    await createProduct(submitData);
    
    toast.success("Product created successfully!");
    router.push("/products");
    
  } catch (error: any) {
    console.error("Error creating product:", error);
    toast.error(error.message || "Failed to create product");
  } finally {
    isSubmitting.value = false;
  }
};

// ✅ Handle input changes
const updateField = (field: string, value: any) => {
  (formData.value as any)[field] = value;
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Create New Product</h1>
      <Button @click="router.push('/products')" variant="outline">
        Back to Products
      </Button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
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
                  v-model="formData.name" 
                  placeholder="Enter product name" 
                  required 
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="slug">
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input 
                  v-model="formData.slug" 
                  placeholder="Enter URL slug" 
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  v-model="formData.description"
                  class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter product description"
                />
              </FormControl>
            </FormItem>
          </FormField>

          <div class="grid md:grid-cols-2 gap-4">
            <FormField name="keywords_seo_ar">
              <FormItem>
                <FormLabel>SEO Keywords (Arabic)</FormLabel>
                <FormControl>
                  <Input 
                    v-model="formData.keywords_seo_ar" 
                    placeholder="Enter Arabic SEO keywords" 
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="keywords_seo_en">
              <FormItem>
                <FormLabel>SEO Keywords (English)</FormLabel>
                <FormControl>
                  <Input 
                    v-model="formData.keywords_seo_en" 
                    placeholder="Enter English SEO keywords" 
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <FormField name="description_seo_ar">
              <FormItem>
                <FormLabel>SEO Description (Arabic)</FormLabel>
                <FormControl>
                  <Input 
                    v-model="formData.description_seo_ar" 
                    placeholder="Enter Arabic SEO description" 
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="description_seo_en">
              <FormItem>
                <FormLabel>SEO Description (English)</FormLabel>
                <FormControl>
                  <Input 
                    v-model="formData.description_seo_en" 
                    placeholder="Enter English SEO description" 
                  />
                </FormControl>
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
                  :model-value="formData.category" 
                  @update:model-value="(value) => updateField('category', value)"
                  :disabled="catalogLoading"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      v-for="category in categories" 
                      :key="category.id" 
                      :value="category.id.toString()"
                    >
                      {{ category.name }}
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
                  :model-value="formData.brand" 
                  @update:model-value="(value) => updateField('brand', value)"
                  :disabled="catalogLoading"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      v-for="brand in brands" 
                      :key="brand.id" 
                      :value="brand.id.toString()"
                    >
                      {{ brand.name }}
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
                  :model-value="formData.unit" 
                  @update:model-value="(value) => updateField('unit', value)"
                  :disabled="catalogLoading"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                      v-for="unit in units" 
                      :key="unit.id" 
                      :value="unit.id.toString()"
                    >
                      {{ unit.name }}
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
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <FormField name="sku">
            <FormItem>
              <FormLabel>SKU *</FormLabel>
              <FormControl>
                <Input 
                  v-model="formData.sku" 
                  placeholder="Enter SKU" 
                  required 
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="barcode">
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input 
                  v-model="formData.barcode" 
                  placeholder="Enter barcode" 
                />
              </FormControl>
            </FormItem>
          </FormField>

          <div class="grid md:grid-cols-3 gap-4">
            <FormField name="quantity">
              <FormItem>
                <FormLabel>Quantity *</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="formData.quantity" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="online_units">
              <FormItem>
                <FormLabel>Online Units *</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="formData.online_units" 
                    type="number" 
                    min="1" 
                    placeholder="1" 
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="max_order">
              <FormItem>
                <FormLabel>Max Order</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="formData.max_order" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <FormField name="weight">
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input 
                  v-model.number="formData.weight" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                />
              </FormControl>
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
                      v-model.number="formData.featured" 
                      type="checkbox" 
                      :true-value="1" 
                      :false-value="0" 
                    />
                    <label for="featured" class="text-sm font-medium cursor-pointer">
                      Mark as Featured
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="isOnline">
              <FormItem>
                <FormLabel>Online Availability</FormLabel>
                <FormControl>
                  <div class="flex items-center gap-2">
                    <input 
                      id="online" 
                      v-model.number="formData.isOnline" 
                      type="checkbox" 
                      :true-value="1" 
                      :false-value="0" 
                    />
                    <label for="online" class="text-sm font-medium cursor-pointer">
                      Available Online
                    </label>
                  </div>
                </FormControl>
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
                    v-model.number="formData.buying_price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00" 
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="selling_price">
              <FormItem>
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="formData.selling_price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00" 
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="price">
              <FormItem>
                <FormLabel>Final Price *</FormLabel>
                <FormControl>
                  <Input 
                    v-model.number="formData.price" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00" 
                    required 
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>

          <FormField name="tax">
            <FormItem>
              <FormLabel>Tax (%)</FormLabel>
              <FormControl>
                <Input 
                  v-model.number="formData.tax" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="100" 
                  placeholder="0.00" 
                />
              </FormControl>
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
                  v-model="formData.content"
                  class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter rich content (HTML supported)"
                />
              </FormControl>
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
          <FormField name="item_isdisabled">
            <FormItem>
              <FormLabel>Item Disabled Status</FormLabel>
              <FormControl>
                <Input 
                  v-model.number="formData.item_isdisabled" 
                  type="number" 
                  min="0" 
                  max="1" 
                  placeholder="0 or 1" 
                />
              </FormControl>
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
