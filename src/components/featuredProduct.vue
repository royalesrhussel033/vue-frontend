<script setup>
import ProductCard from './productCard.vue'
import { useProductStore } from '@/stores/products'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { LoaderCircle, RefreshCw } from '@lucide/vue'

const getProducts = useProductStore()
const { featuredProducts, featuredProductsError, featuredProductsLoading } = storeToRefs(getProducts)

onMounted(() => {
  getProducts.fetchUserProducts()
})

</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl mb-4 tracking-wider">New Arrivals</h2>
      <p class="text-gray-600 tracking-wide">Discover our latest collection</p>
    </div>

    <div v-if="featuredProductsLoading" class="flex items-center justify-center gap-2 py-12 text-sm text-gray-600" role="status">
      <LoaderCircle :size="18" class="animate-spin" aria-hidden="true" />
      <span>Finding fresh pieces...</span>
    </div>
    <div v-else-if="featuredProductsError" class="py-10 text-center" role="alert">
      <p class="text-sm text-gray-600">{{ featuredProductsError }}</p>
      <button
        type="button"
        class="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-black hover:bg-gray-50"
        @click="getProducts.fetchUserProducts()"
      >
        <RefreshCw :size="15" aria-hidden="true" />
        Try again
      </button>
    </div>
    <p v-else-if="!featuredProducts.length" class="py-10 text-center text-sm text-gray-600">
      No new pieces just yet. Check back soon for the next drop.
    </p>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      <ProductCard
        v-for="product in featuredProducts"
        :key="product.id"
        v-bind="product"
      />
    </div>
  </section>
</template>