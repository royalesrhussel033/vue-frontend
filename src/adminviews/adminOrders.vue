<script setup>
import adminSidebar from '@/components/adminSidebar.vue'
import { orderStore } from '@/stores/orders';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const orders = orderStore()
const expandedOrderId = ref(null) // Tracks which order card is expanded

const formatDate = (value) => {
  return new Date(value).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const { items, isLoading } = storeToRefs(orders)

onMounted(() => {
    orders.getAdminOrders()
})

// Toggle accordion expand/collapse
const toggleExpand = (id) => {
  expandedOrderId.value = expandedOrderId.value === id ? null : id
}

const getStatusBadgeClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
  
  const base = 'px-2.5 py-1 text-xs font-semibold rounded-full border ';
  switch (status.toLowerCase()) {
    case 'pending': return base + 'bg-amber-50 text-amber-700 border-amber-200';
    case 'processing': return base + 'bg-blue-50 text-blue-700 border-blue-200';
    case 'shipped': return base + 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'delivered': return base + 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'cancelled': return base + 'bg-rose-50 text-rose-700 border-rose-200';
    default: return base + 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

const changeOrderStatus = async (orderId, status) => {
  try {
    await orders.updateOrderStatus(orderId, status)
    await orders.getAdminOrders()
  } catch (err) {
    console.error('Unable to update order status', err)
  }
}
</script>

<template>
  <adminSidebar>
    <div class="p-6 md:p-8 w-full mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 ">Orders Management</h1>
          <p class="text-sm text-gray-500 mt-1">Monitor, adjust status, and review active client orders.</p>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col justify-center items-center py-20">
        <div class="animate-spin rounded-full h-9 w-9 border-2 border-indigo-600 border-t-transparent mb-4"></div>
        <p class="text-gray-500 text-sm font-medium">Fetching sync cycles...</p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="item in items" 
          :key="item.id" 
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
          :class="{'ring-1 ring-indigo-500 border-indigo-500': expandedOrderId === item.id}"
        >
          <div 
            @click="toggleExpand(item.id)" 
            class="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
          >
            <div class="flex items-center gap-4 min-w-50">
              <span class="text-sm font-bold text-indigo-600 font-mono bg-indigo-50 px-2.5 py-1 rounded-md">
                #{{ item.id }}
              </span>
              <div>
                <h3 class="text-sm font-semibold text-gray-900">
                  {{ item.customer_name || 'Unknown Customer' }}
                </h3>
                <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(item.created_at) }}</p>
              </div>
            </div>

            <div class="flex items-center gap-6 ml-auto sm:ml-0">
              <div class="text-right">
                <p class="text-sm font-bold text-gray-900">
                  ₱{{ Number(item.total).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                </p>
              </div>
              
              <div>
                <span :class="getStatusBadgeClass(item.status)">
                  {{ item.status || 'Unknown' }}
                </span>
              </div>

              <svg 
                class="w-5 h-5 text-gray-400 transition-transform duration-200" 
                :class="{'rotate-180 text-indigo-600': expandedOrderId === item.id}"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div 
            v-show="expandedOrderId === item.id" 
            class="border-t border-gray-100 bg-gray-50/50 p-5 space-y-5"
          >
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</p>
                <p class="text-sm font-bold text-gray-800 mt-1">{{ item.product_name || 'N/A' }}</p>
                <div class="flex gap-4 mt-1.5 text-xs text-gray-500">
                  <span>Qty: <strong class="text-gray-700">{{ item.quantity || 1 }}</strong></span>
                  <span class="border-l border-gray-200 pl-4">
                    Size: <span class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-semibold">{{ item.size_name || 'N/A' }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2.5">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer Details</p>
                <div>
                  <p class="text-xs text-gray-400">Email</p>
                  <p class="text-sm font-medium text-gray-700 break-all">{{ item.customer_email || 'No email attached' }}</p>
                </div>
              </div>

              <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2.5">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shipping Destination</p>
                <div>
                  <p class="text-xs text-gray-400">Phone</p>
                  <p class="text-sm font-medium text-gray-700">{{ item.delivery_phone || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-400 mt-1">Address</p>
                  <p class="text-sm font-medium text-gray-700 line-clamp-2" :title="item.delivery_address">
                    {{ item.delivery_address || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Update Progress State:</span>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-if="item.status === 'Pending'"
                  @click="changeOrderStatus(item.id, 'Processing')" 
                  class="px-3 py-1.5 bg-white text-xs text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer"
                >
                  Mark Processing
                </button>
                <button 
                  v-if="item.status === 'Processing'"
                  @click="changeOrderStatus(item.id, 'Shipped')" 
                  class="px-3 py-1.5 bg-white text-xs text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer"
                >
                  Mark Shipped
                </button>
                <button 
                  v-if="item.status === 'Shipped'"
                  @click="changeOrderStatus(item.id, 'Delivered')" 
                  class="px-3 py-1.5 bg-white text-xs text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all cursor-pointer"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="items.length === 0" class="text-center py-16 bg-white border border-dashed border-gray-200 rounded-xl">
          <p class="text-gray-400 text-sm italic">No user orders found on file.</p>
        </div>
      </div>

    </div>
  </adminSidebar>
</template>