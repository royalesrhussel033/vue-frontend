<script setup>
defineProps({
  data: Object
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Revenue Card -->
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500 text-sm">Total Revenue</p>
      <p class="text-3xl font-bold text-gray-900">₱{{ Number(data.totalRevenue).toLocaleString() }}</p>
      <p class="text-green-600 text-xs mt-2">↑ from last month</p>
    </div>

    <!-- Orders Card -->
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500 text-sm">Total Orders</p>
      <p class="text-3xl font-bold text-gray-900">{{ data.totalOrders }}</p>
      <p class="text-yellow-600 text-xs mt-2">{{ data.pendingOrders }} pending</p>
    </div>

    <!-- Products Card -->
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500 text-sm">Products</p>
      <p class="text-3xl font-bold text-gray-900">{{ data.totalProducts }}</p>
      <p class="text-blue-600 text-xs mt-2">Active inventory</p>
    </div>

    <!-- Users Card -->
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500 text-sm">Active Users</p>
      <p class="text-3xl font-bold text-gray-900">{{ data.activeUsers }}</p>
      <p class="text-purple-600 text-xs mt-2">This month</p>
    </div>
  </div>
</template>