<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  orders: Array
});

defineEmits(['refresh']);

const getStatusColor = (status) => {
  const colors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-stone-100 text-stone-800',
    'delivered': 'bg-emerald-100 text-emerald-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
</script>

<template>
  <div class="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
    <div class="border-b border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900">Recent Orders</h2>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
          </tr>
        </thead>
        <tbody v-if="orders?.length">
          <tr v-for="order in orders" :key="order.id" class="border-t border-gray-200 hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">#{{ order.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ order.customer_name }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ order.product_name }}</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">₱{{ Number(order.total).toFixed(2) }}</td>
            <td class="px-6 py-4">
              <span :class="`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`">
                {{ order.status }}
              </span>
            </td>
            
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
              No recent orders yet. New orders will appear here.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>