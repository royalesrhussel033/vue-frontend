<script setup>
import myOrderItem from '@/components/myOrderItem.vue'
import orderDetailsModal from '@/components/orderDetailsModal.vue'
import { orderStore } from '@/stores/orders'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { MessageCircle, ShoppingBag } from '@lucide/vue'

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
          Follow your order from confirmation through delivery.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-black" role="status" aria-label="Loading your orders"></div>
      </div>

      <div v-else-if="order.error" class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
        {{ order.error }}
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
                @confirmed="order.getOrders()"
              />
            </ul>
          </div>
        </section>

        <!-- Helpful Sidebar (Takes up remaining 4 columns) -->
        <aside class="lg:col-span-4 mt-10 lg:mt-0">
          <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Need a hand?</h2>
            <ul class="space-y-4 text-sm text-gray-600">
              <li>
                <RouterLink :to="{ name: 'contactUs' }" class="flex items-center transition-colors hover:text-gray-900">
                  <MessageCircle class="mr-3 text-gray-500" :size="19" aria-hidden="true" />
                  <span>Contact our team</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
        <ShoppingBag class="mx-auto mb-4 text-gray-400" :size="38" aria-hidden="true" />
        <h2 class="text-xl font-medium text-gray-900">Your next great find is out there</h2>
        <p class="mt-2 text-gray-500">Once you place an order, you’ll be able to follow it here.</p>
        <RouterLink :to="{ name: 'shop'}" class="mt-6 inline-flex items-center rounded-lg border border-transparent bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800">
          Explore the shop
        </RouterLink>
      </div>

      <!-- Modal -->
      <orderDetailsModal v-if="showModal" :order-id="selectedOrderId" @close="showModal = false" />

    </div>
  </div>
</template>