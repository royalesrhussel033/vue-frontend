<script setup>
import ProductCard from './productCard.vue'
import { useProductStore } from '@/stores/products';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

const getBestSeller = useProductStore()
const { bestSellerProducts } = storeToRefs(getBestSeller)

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

    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      <ProductCard
        v-for="product in bestSellerProducts"
        :key="product.id"
        v-bind="product"
      />
    </div>
  </section>
</template>