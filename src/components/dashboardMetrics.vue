<script setup>
defineProps({
  data: Object
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Revenue Card -->
    <div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p class="text-gray-500 text-sm">Total Revenue</p>
      <p class="text-3xl font-bold text-gray-900">₱{{ Number(data.totalRevenue).toLocaleString() }}</p>
      <p class="mt-2 text-xs text-gray-500">Lifetime sales</p>
    </div>

    <!-- Orders Card -->
    <div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p class="text-gray-500 text-sm">Total Orders</p>
      <p class="text-3xl font-bold text-gray-900">{{ data.totalOrders }}</p>
      <p class="mt-2 text-xs text-amber-700">{{ data.pendingOrders }} awaiting fulfillment</p>
    </div>

    <!-- Products Card -->
    <div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p class="text-gray-500 text-sm">Products</p>
      <p class="text-3xl font-bold text-gray-900">{{ data.totalProducts }}</p>
      <p class="mt-2 text-xs text-gray-500">Pieces currently listed</p>
    </div>

    <!-- Users Card -->
    <div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p class="text-gray-500 text-sm">Active Users</p>
      <p class="text-3xl font-bold text-gray-900">{{ data.activeUsers }}</p>
      <p class="mt-2 text-xs text-gray-500">Registered shoppers</p>
    </div>
  </div>
</template>