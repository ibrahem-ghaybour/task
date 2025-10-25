<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProductsStore } from '~/stores/products'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const route = useRoute()
const id = Number(route.params.id)
const store = useProductsStore()
const activeTab = ref('description')

onMounted(async () => {
  await store.fetchProductById(id)
})

const product = computed(() => store.productDetail)
</script>

<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <!-- Loading & Error States -->
    <div v-if="store.loading" class="text-center text-gray-500 py-10">Loading...</div>
    <div v-else-if="store.error" class="text-center text-red-500 py-10">{{ store.error }}</div>

    <div v-else-if="product" class="grid lg:grid-cols-3 gap-6">
      <!-- Left: Image -->
      <Card class="col-span-1 overflow-hidden rounded-2xl shadow-md">
        <CardContent class="p-4 flex justify-center items-center bg-gray-50">
          <img
            :src="`/images/${product.images?.[0]}.jpg`"
            alt="Product Image"
            class="rounded-xl object-contain max-h-[400px]"
          />
        </CardContent>
      </Card>

      <!-- Right: Info -->
      <div class="col-span-2 space-y-6">
        <Card class="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle class="text-3xl font-bold flex items-center gap-3">
              {{ product.name }}
              <Badge v-if="product.isOnline" variant="success">Online</Badge>
              <Badge v-if="product.featured" variant="secondary">Featured</Badge>
            </CardTitle>
            <CardDescription v-html="product.description"></CardDescription>
          </CardHeader>

          <CardContent class="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div><strong>Brand:</strong> {{ product.brand?.name }}</div>
            <div><strong>Category:</strong> {{ product.category?.name }}</div>
            <div><strong>Unit:</strong> {{ product.unit?.name }}</div>
            <div><strong>Stock:</strong> {{ Number(product.item_balance).toLocaleString() }}</div>
            <div><strong>Weight:</strong> {{ product.weight }}</div>
            <div><strong>Max Order:</strong> {{ product.max_order }}</div>
            <div><strong>Barcode:</strong> {{ product.barcode }}</div>
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
                <table class="w-full text-sm border-collapse">
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
