<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProductsStore } from '~/stores/products'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-vue-next'
const route = useRoute()
const id = Number(route.params.id)
const store = useProductsStore()
const activeTab = ref('description')
const currentMainImage = ref<string>('')

onMounted(async () => {
  await store.fetchProductById(id)
  // Set the first image as main image if available
  if (store.productDetail?.images && store.productDetail.images.length > 0) {
    currentMainImage.value = store.productDetail.images[0] || ''
  }
})

const product = computed(() => store.productDetail)

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
  // The fallback div will be shown automatically
}

// Set main image when thumbnail is clicked
const setMainImage = (imageUrl: string) => {
  currentMainImage.value = imageUrl
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <!-- Loading & Error States -->
    <div v-if="store.loading" class="text-center text-gray-500 py-10">Loading...</div>
    <div v-else-if="store.error" class="text-center text-red-500 py-10">{{ store.error }}</div>

    <div v-else-if="product" class="grid lg:grid-cols-3 gap-6">
      <!-- Left: Images -->
      <Card class="col-span-1 overflow-hidden rounded-2xl shadow-md">
        <CardContent class="p-4 bg-gray-50 min-h-[400px]">
          <!-- Main Image -->
          <div class="flex justify-center items-center h-[350px] mb-4">
            <img
              v-if="currentMainImage"
              :src="currentMainImage"
              :alt="`${product.name} Image`"
              class="rounded-xl object-contain max-h-[350px] w-full"
              @error="handleImageError"
            />
            <div v-else class="flex flex-col justify-center items-center h-full text-gray-500">
              <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="text-sm text-gray-400">No image available</p>
            </div>
          </div>
          
          <!-- Thumbnail Images -->
          <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-2">
            <img
              v-for="(image, index) in product.images.slice(1, 5)"
              :key="index"
              :src="image"
              :alt="`${product.name} Image ${index + 2}`"
              class="w-full h-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
              @click="setMainImage(image)"
              @error="handleImageError"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Right: Info -->
      <div class="col-span-2 space-y-6">
        <Card class="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle class="text-3xl font-bold flex items-center gap-3">
              {{ product.name }}
              <Badge v-if="product.isOnline" variant="secondary">Online</Badge>
              <Badge v-if="product.featured" variant="secondary">Featured</Badge>
            </CardTitle>
            <CardDescription v-html="product.description"></CardDescription>
          </CardHeader>

          <CardContent class="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div><strong>Brand:</strong> {{ typeof product.brand === 'object' ? product.brand?.name : 'N/A' }}</div>
            <div><strong>Category:</strong> {{ typeof product.category === 'object' ? product.category?.name : 'N/A' }}</div>
            <div><strong>Unit:</strong> {{ typeof product.unit === 'object' ? product.unit?.name : 'N/A' }}</div>
            <div><strong>Stock:</strong> {{ product.item_balance ? Number(product.item_balance).toLocaleString() : 'N/A' }}</div>
            <div><strong>Weight:</strong> {{ product.weight || 'N/A' }}</div>
            <div><strong>Max Order:</strong> {{ product.max_order }}</div>
            <div><strong>Barcode:</strong> {{ product.barcode || 'N/A' }}</div>
            <div><strong>SKU:</strong> {{ product.sku }}</div>
          </CardContent>
        </Card>

        <!-- Tabs Section -->
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="mb-4">
            <TabsTrigger :class="{ 'bg-primary text-primary-foreground': activeTab === 'description' }"  value="description">Description</TabsTrigger>
            <TabsTrigger :class="{ 'bg-primary text-primary-foreground': activeTab === 'specs' }"  value="specs">Specifications</TabsTrigger>
            <TabsTrigger :class="{ 'bg-primary text-primary-foreground': activeTab === 'seo' }"  value="seo">SEO</TabsTrigger>
          </TabsList>
          <!-- Tab: Description -->
          <TabsContent value="description">
            <Card>
              <CardContent class="p-6">
                <p v-html="product.content"></p>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Tab: Specs -->
          <TabsContent value="specs">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <table v-if="product.sections && product.sections.length > 0" class="w-full text-sm border-collapse">
                  <tbody>
                    <tr
                      v-for="section in product.sections"
                      :key="section.id"
                      class="border-b last:border-0"
                    >
                      <td colspan="2" class="py-2 font-semibold text-gray-700">
                        {{ section.name }}
                      </td>
                    </tr>
                    <tr
                      v-for="item in product.sections?.[0]?.items"
                      :key="item.id"
                      class="border-b last:border-0"
                    >
                      <td class="py-2 font-medium text-gray-600">{{ item.key }}</td>
                      <td class="py-2 text-gray-700">{{ item.value }}</td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="text-center text-gray-500 py-8">
                  <p>No specifications available</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Tab: SEO -->
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Information</CardTitle>
              </CardHeader>
              <CardContent class="space-y-2 text-sm text-gray-700">
                <p><strong>SEO Description (EN):</strong> {{ product.description_seo_en }}</p>
                <p><strong>Keywords (EN):</strong> {{ product.keywords_seo_en }}</p>
                <p><strong>SEO Description (AR):</strong> {{ product.description_seo_ar }}</p>
                <p><strong>Keywords (AR):</strong> {{ product.keywords_seo_ar }}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <!-- Price Card -->
        <Card class="rounded-2xl shadow-md border border-green-200 bg-green-50">
          <CardContent class="p-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Price</h3>
              <p class="text-3xl font-bold text-green-600">
                {{ Number(product.price).toLocaleString() }} EGP
              </p>
              <p class="text-sm text-gray-500 mt-1">Tax: {{ product.tax }}</p>
            </div>
            <button
              class="bg-green-600 text-white rounded-xl px-6 py-3 font-medium hover:bg-green-700 transition"
            >
              🛒 Add to Cart
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
