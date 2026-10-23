<script setup>
import { ref, computed } from 'vue';
import { CircleCheck, Package } from '@lucide/vue'

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
  
  return items?.slice().sort((a, b) => {
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

</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
    <!-- Header -->
    <div class="border-b border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-900"><Package :size="19" /> Stock alerts</h2>
          <p class="text-sm text-gray-500">{{ criticalItems.length }} items with fewer than 5 in stock</p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap gap-3 border-b border-gray-200 bg-gray-50 p-4">
      <button
        @click="showCritical = !showCritical"
        :class="`px-4 py-2 rounded text-sm font-medium transition ${
          showCritical 
            ? 'bg-black text-white'
            : 'bg-white text-gray-700 border border-gray-300'
        }`"
      >
        {{ showCritical ? 'Show all stock' : 'Show critical only' }} ({{ criticalItems.length }})
      </button>

      <select
        v-model="sortBy"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="stock">Sort by Stock Level</option>
        <option value="name">Sort by Name</option>
      </select>
    </div>

    <!-- Content -->
    <div class="p-5 sm:p-6">
      <div v-if="filteredItems?.length" class="space-y-3">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="flex items-center justify-between rounded-xl border-l-4 p-4"
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

        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!items?.length" class="py-8 text-center">
        <p class="font-semibold text-gray-900">No products to monitor yet</p>
        <p class="text-sm text-gray-500">Inventory will appear here as products are added.</p>
      </div>
      <div v-else-if="showCritical" class="py-8 text-center">
        <CircleCheck class="mx-auto mb-2 text-emerald-700" :size="24" aria-hidden="true" />
        <p class="font-semibold text-gray-900">No critical stock alerts</p>
        <p class="text-sm text-gray-500">No items currently have fewer than five in stock.</p>
      </div>
      <div v-else class="py-8 text-center">
        <CircleCheck class="mx-auto mb-2 text-emerald-700" :size="24" aria-hidden="true" />
        <p class="font-semibold text-gray-900">Inventory looks good</p>
        <p class="text-sm text-gray-500">There are no low-stock alerts right now.</p>
      </div>
    </div>
  </div>
</template>