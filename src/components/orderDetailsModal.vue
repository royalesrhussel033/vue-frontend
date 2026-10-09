<script setup>
import { watch } from 'vue'
import { orderStore } from '@/stores/orders'

const props = defineProps({
  orderId: { type: [String, Number], required: true }
})
const emit = defineEmits(['close'])

const store = orderStore()

watch(() => props.orderId, async (id) => {
  if (id) {
    await store.getOrder(id)
  }
}, { immediate: true })

// Dynamically style status badges to make it pop
const getStatusClass = (status) => {
  const base = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider'
  switch (status?.toLowerCase()) {
    case 'pending': return `${base} bg-amber-50 text-amber-700 border border-amber-200`
    case 'completed': case 'delivered': return `${base} bg-emerald-50 text-emerald-700 border border-emerald-200`
    case 'cancelled': return `${base} bg-rose-50 text-rose-700 border border-rose-200`
    default: return `${base} bg-blue-50 text-blue-700 border border-blue-200`
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
      
      <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 class="text-xl font-bold text-gray-900 tracking-tight">Order Details</h2>
          <p v-if="store.selectedOrder" class="text-xs text-gray-500 mt-0.5">
            ID: <span class="font-mono text-gray-700">#{{ store.selectedOrder.id }}</span>
          </p>
        </div>
        <button 
          @click="$emit('close')" 
          class="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div v-if="store.selectedOrder" class="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50/50">
        
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
          <div>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Status</p>
            <div class="mt-1">
              <span :class="getStatusClass(store.selectedOrder.status)">
                {{ store.selectedOrder.status || 'Processing' }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Amount</p>
            <p class="text-xl font-extrabold text-gray-900 mt-0.5">
              ₱{{ parseFloat(store.selectedOrder.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
            </p>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</h3>
          <div v-if="store.selectedOrder.items?.length" class="space-y-3">
            <div 
              v-for="item in store.selectedOrder.items" 
              :key="item.id" 
              class="flex gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm items-center"
            >
              <div class="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0 border border-gray-200 overflow-hidden">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-cover" />
                <span v-else class="text-xs font-medium">🛍️</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800 text-sm truncate">{{ item.name }}</p>
                <div class="flex gap-3 mt-1 text-xs text-gray-500">
                  <span>Qty: <strong class="text-gray-700">{{ item.quantity }}</strong></span>
                  <span class="border-l border-gray-200 pl-3">
                    Size: <span class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">{{ item.size_name || 'N/A' }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
            No items found in this order.
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer Details</h4>
            <div>
              <p class="text-xs text-gray-400">Buyer Name</p>
              <p class="text-sm font-medium text-gray-800">{{ store.selectedOrder.first_name || 'N/A' }} {{ store.selectedOrder.last_name || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Receiver Name</p>
              <p class="text-sm font-medium text-gray-800">{{ store.selectedOrder.delivery_name || 'N/A' }}</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shipping Details</h4>
            <div>
              <p class="text-xs text-gray-400">Phone Number</p>
              <p class="text-sm font-medium text-gray-800">{{ store.selectedOrder.delivery_phone || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Delivery Address</p>
              <p class="text-sm font-medium text-gray-800 line-clamp-2" :title="store.selectedOrder.delivery_address">
                {{ store.selectedOrder.delivery_address || 'N/A' }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="p-12 text-center flex-1 flex flex-col items-center justify-center bg-gray-50/50">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mb-3"></div>
        <p class="text-sm text-gray-500 font-medium">Fetching secure order details...</p>
      </div>

      <div class="bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
        <button 
          @click="$emit('close')" 
          class="px-5 py-2 bg-gray-900 text-white font-medium text-sm rounded-xl hover:bg-gray-800 shadow-sm transition-all cursor-pointer hover:shadow"
        >
          Got it
        </button>
      </div>

    </div>
  </div>
</template>