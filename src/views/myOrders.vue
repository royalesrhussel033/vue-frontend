<script setup>
import myOrderItem from '@/components/myOrderItem.vue'
import orderDetailsModal from '@/components/orderDetailsModal.vue'
import { orderStore } from '@/stores/orders'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const order = orderStore()
// Highly recommend adding an 'isLoading' state to your store 
// so the empty state doesn't flash while fetching!
const { items, isLoading } = storeToRefs(order) 

const showModal = ref(false)
const selectedOrderId = ref(null)

onMounted(() => {
    order.getOrders()
})

function openOrderDetails(id) {
  selectedOrderId.value = id
  showModal.value = true
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <!-- Header -->
      <div class="mb-10 sm:flex sm:items-baseline sm:justify-between">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">My Orders</h1>
        <p class="text-sm text-gray-500 mt-2 sm:mt-0">
          Check the status of recent orders, manage returns, and download invoices.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Order Grid -->
      <div v-else-if="items.length > 0" class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        
        <!-- Product List (Takes up 8 columns) -->
        <section class="lg:col-span-8">
          <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-gray-200">
            <ul class="divide-y divide-gray-200">
              <myOrderItem 
                v-for="item in items" 
                :key="item.id" 
                :item="item"
                @viewDetails="openOrderDetails"
                @confirmed="order.getOrder()"
              />
            </ul>
          </div>
        </section>

        <!-- Helpful Sidebar (Takes up remaining 4 columns) -->
        <aside class="lg:col-span-4 mt-10 lg:mt-0">
          <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Need Help?</h2>
            <ul class="space-y-4 text-sm text-gray-600">
              <li class="flex items-center hover:text-indigo-600 cursor-pointer transition-colors">
                <svg class="h-5 w-5 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Contact Customer Support</span>
              </li>
              <li class="flex items-center hover:text-indigo-600 cursor-pointer transition-colors">
                <svg class="h-5 w-5 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Read our Return Policy</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="text-xl font-medium text-gray-900">No orders placed yet</h2>
        <p class="mt-2 text-gray-500">When you purchase something, it will appear here.</p>
        <RouterLink :to="{ name: 'shop'}" class="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
          Start Shopping →
        </RouterLink>
      </div>

      <!-- Modal -->
      <orderDetailsModal v-if="showModal" :order-id="selectedOrderId" @close="showModal = false" />

    </div>
  </div>
</template>