<script setup>
import adminSidebar from '@/components/adminSidebar.vue'
import { orderStore } from '@/stores/orders';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toastification'
import { LoaderCircle } from '@lucide/vue'

const orders = orderStore()
const toast = useToast()
const expandedOrderId = ref(null) // Tracks which order card is expanded
const updatingOrderId = ref(null)
const updatingStatus = ref('')

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
  if (updatingOrderId.value !== null) return
  updatingOrderId.value = orderId
  updatingStatus.value = status

  try {
    await orders.updateOrderStatus(orderId, status)
    await orders.getAdminOrders()
    toast.success(`Order #${orderId} is now ${status.toLowerCase()}.`)
  } catch (err) {
    console.error('Unable to update order status', err)
    if (err.response?.status === 409) {
      await orders.getAdminOrders()
    }
    await Swal.fire({
      title: 'Unable to update order',
      text: err.response?.data?.message || 'Please refresh the order list and try again.',
      icon: 'error',
      confirmButtonText: 'Okay'
    })
  } finally {
    updatingOrderId.value = null
    updatingStatus.value = ''
  }
}
</script>

<template>
  <adminSidebar>
    <div class="p-6 md:p-8 w-full mx-auto">
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage orders</h1>
          <p class="mt-1 text-sm text-gray-500">Review customer orders and move each one through fulfillment.</p>
        </div>
      </div>

      <div v-if="orders.error" class="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
        <p>{{ orders.error }}</p>
        <button @click="orders.getAdminOrders()" class="rounded-lg border border-red-300 px-4 py-2 font-medium transition hover:bg-red-100">Try again</button>
      </div>

      <div v-else-if="isLoading" class="flex flex-col justify-center items-center py-20">
        <div class="mb-4 h-9 w-9 animate-spin rounded-full border-2 border-stone-200 border-t-black"></div>
        <p class="text-sm font-medium text-gray-500">Loading orders…</p>
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
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Update order status</span>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-if="item.status === 'Pending'"
                  @click="changeOrderStatus(item.id, 'Processing')" 
                  :disabled="updatingOrderId === item.id"
                  class="px-3 py-1.5 bg-white text-xs text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LoaderCircle v-if="updatingStatus === 'Processing' && updatingOrderId === item.id" :size="14" class="mr-1 inline animate-spin" aria-hidden="true" />
                  {{ updatingStatus === 'Processing' && updatingOrderId === item.id ? 'Updating…' : 'Mark Processing' }}
                </button>
                <button 
                  v-if="item.status === 'Processing'"
                  @click="changeOrderStatus(item.id, 'Shipped')" 
                  :disabled="updatingOrderId === item.id"
                  class="px-3 py-1.5 bg-white text-xs text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LoaderCircle v-if="updatingStatus === 'Shipped' && updatingOrderId === item.id" :size="14" class="mr-1 inline animate-spin" aria-hidden="true" />
                  {{ updatingStatus === 'Shipped' && updatingOrderId === item.id ? 'Updating…' : 'Mark Shipped' }}
                </button>
                <button 
                  v-if="item.status === 'Shipped'"
                  @click="changeOrderStatus(item.id, 'Delivered')" 
                  :disabled="updatingOrderId === item.id"
                  class="px-3 py-1.5 bg-white text-xs text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LoaderCircle v-if="updatingStatus === 'Delivered' && updatingOrderId === item.id" :size="14" class="mr-1 inline animate-spin" aria-hidden="true" />
                  {{ updatingStatus === 'Delivered' && updatingOrderId === item.id ? 'Updating…' : 'Mark Delivered' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="items.length === 0" class="text-center py-16 bg-white border border-dashed border-gray-200 rounded-xl">
          <p class="text-sm text-gray-500">No open orders right now. New customer orders will appear here.</p>
        </div>
      </div>

    </div>
  </adminSidebar>
</template>