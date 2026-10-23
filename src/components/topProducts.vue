<script setup>
defineProps({ products: Array });
</script>

<template>
  <div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
    <div v-if="products?.length" class="space-y-3">
      <div v-for="product in products.slice(0, 5)" :key="product.id" class="flex justify-between items-center p-3 bg-gray-50 rounded">
        <span class="font-medium text-gray-900">{{ product.name }}</span>
        <span class="text-sm text-gray-600">{{ product.quantity }} {{ product.quantity === 1 ? 'piece' : 'pieces' }} sold</span>
      </div>
    </div>
    <p v-else class="text-sm text-gray-500">Completed sales will bring your best-selling pieces here.</p>
  </div>
</template>