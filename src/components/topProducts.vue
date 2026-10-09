<script setup>
defineProps({ products: Array });
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
    <div v-if="products?.length" class="space-y-3">
      <div v-for="product in products.slice(0, 5)" :key="product.id" class="flex justify-between items-center p-3 bg-gray-50 rounded">
        <span class="font-medium text-gray-900">{{ product.name }}</span>
        <span class="text-sm text-gray-600">{{ product.quantity }} sold</span>
      </div>
    </div>
    <p v-else class="text-gray-500">No products yet</p>
  </div>
</template>