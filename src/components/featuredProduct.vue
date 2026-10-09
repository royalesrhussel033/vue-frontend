<script setup>
import ProductCard from './productCard.vue'
import { useProductStore } from '@/stores/products'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const getProducts = useProductStore()
const { featuredProducts } = storeToRefs(getProducts)

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

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      <ProductCard
        v-for="product in featuredProducts"
        :key="product.id"
        v-bind="product"
      />
    </div>
  </section>
</template>