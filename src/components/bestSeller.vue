<script setup>
import ProductCard from './productCard.vue'
import { useProductStore } from '@/stores/products';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { LoaderCircle, RefreshCw } from '@lucide/vue'

const getBestSeller = useProductStore()
const { bestSellerProducts, bestSellerProductsError, bestSellerProductsLoading } = storeToRefs(getBestSeller)

onMounted(() => {
  getBestSeller.fetchBestSeller()
})



</script>

<template>
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl mb-4 tracking-wider">Bestsellers</h2>
      <p class="text-gray-600 tracking-wide">Our most loved pieces</p>
    </div>

    <div v-if="bestSellerProductsLoading" class="flex items-center justify-center gap-2 py-12 text-sm text-gray-600" role="status">
      <LoaderCircle :size="18" class="animate-spin" aria-hidden="true" />
      <span>Finding the pieces shoppers love...</span>
    </div>
    <div v-else-if="bestSellerProductsError" class="py-10 text-center" role="alert">
      <p class="text-sm text-gray-600">{{ bestSellerProductsError }}</p>
      <button
        type="button"
        class="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-black hover:bg-gray-50"
        @click="getBestSeller.fetchBestSeller()"
      >
        <RefreshCw :size="15" aria-hidden="true" />
        Try again
      </button>
    </div>
    <p v-else-if="!bestSellerProducts.length" class="py-10 text-center text-sm text-gray-600">
      No bestsellers yet. Explore the shop to find your next favorite.
    </p>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      <ProductCard
        v-for="product in bestSellerProducts"
        :key="product.id"
        v-bind="product"
      />
    </div>
  </section>
</template>