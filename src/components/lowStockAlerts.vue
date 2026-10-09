<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({ items: Array });

const sortBy = ref('stock'); // 'stock', 'name', 'critical'
const showCritical = ref(false);

// Filter only critical items (stock < 5)
const criticalItems = computed(() => 
  props.items?.filter(item => item.stock < 5) || []
);

// Filter based on toggle
const filteredItems = computed(() => {
  let items = showCritical.value ? criticalItems.value : props.items;
  
  return items?.sort((a, b) => {
    if (sortBy.value === 'stock') return a.stock - b.stock;
    if (sortBy.value === 'name') return a.name.localeCompare(b.name);
    return 0;
  }) || [];
});

// Get stock status color
const getStockStatus = (stock) => {
  if (stock < 5) return { text: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-100' };
  if (stock < 20) return { text: 'LOW', color: 'text-orange-600', bg: 'bg-orange-100' };
  return { text: 'OK', color: 'text-green-600', bg: 'bg-green-100' };
};

async function restockProduct(productId) {
  // Handle restock action
  console.log('Restock product:', productId);
}
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">📦 Stock Alerts</h2>
          <p class="text-sm text-gray-500">{{ criticalItems.length }} critical items</p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="p-4 bg-gray-50 border-b border-gray-200 flex gap-4">
      <button
        @click="showCritical = !showCritical"
        :class="`px-4 py-2 rounded text-sm font-medium transition ${
          showCritical 
            ? 'bg-red-600 text-white' 
            : 'bg-white text-gray-700 border border-gray-300'
        }`"
      >
        Show Critical Only ({{ criticalItems.length }})
      </button>

      <select
        v-model="sortBy"
        class="px-3 py-2 border border-gray-300 rounded text-sm"
      >
        <option value="stock">Sort by Stock Level</option>
        <option value="name">Sort by Name</option>
      </select>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div v-if="filteredItems?.length" class="space-y-3">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="p-4 border-l-4 rounded flex items-center justify-between"
          :class="getStockStatus(item.stock).bg"
        >
          <!-- Left: Item Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <div>
                <p class="font-semibold text-gray-900">{{ item.name }}</p>
                <p class="text-sm text-gray-600">ID: {{ item.id }}</p>
              </div>
            </div>
          </div>

          <!-- Center: Stock Info -->
          <div class="text-center mx-6">
            <p class="text-2xl font-bold" :class="getStockStatus(item.stock).color">
              {{ item.stock }}
            </p>
            <p class="text-xs font-semibold" :class="getStockStatus(item.stock).color">
              {{ getStockStatus(item.stock).text }}
            </p>
          </div>

          <!-- Right: Actions -->
          <!-- <div class="flex gap-2">
            <RouterLink
              :to="`/admin/products/${item.id}`"
              class="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
            >
              View
            </RouterLink>
            <button
              @click="restockProduct(item.id)"
              class="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
            >
              + Restock
            </button>
          </div> -->
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <p class="text-green-600 font-semibold text-lg">✓ All products in stock!</p>
        <p class="text-gray-500 text-sm">No low stock alerts at the moment</p>
      </div>
    </div>
  </div>
</template>