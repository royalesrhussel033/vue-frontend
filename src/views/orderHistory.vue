<script setup>
import { ref, computed, onMounted } from 'vue';
import orderDetailsModal from '@/components/orderDetailsModal.vue';
import orderRatingModal from '@/components/orderRatingModal.vue';
import { orderStore } from '@/stores/orders';
import { storeToRefs } from 'pinia';
import { Star } from '@lucide/vue'

const formatDate = (value) => {
  return new Date(value).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
const order = orderStore()
const { items, isLoading } = storeToRefs(order)

const activeFilter = ref('All Orders')
const searchQuery = ref('')

onMounted(() => {
  order.getOrderHistory()
})

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return items.value.filter((item) => {
    const matchesFilter = 
    activeFilter.value === 'All Orders' || item.status === activeFilter.value

    const matchesSearch = 
    !query ||
    item.name?.toLowerCase().includes(query) ||
    String(item.id).includes(query) ||
    item.status?.toLowerCase().includes(query)

    return matchesFilter && matchesSearch
  })
})

const showModal = ref(false)
const selectedOrderId = ref(null)

function openOrderDetails(id) {
  selectedOrderId.value = id
  showModal.value = true
}

const showRatingModal = ref(false)
const selectedProductId = ref(null)

function openRatingModal(productId) {
  selectedProductId.value = productId
  showRatingModal.value = true
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div class="mb-10 sm:flex sm:items-baseline sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Order History</h1>
          <p class="mt-2 text-sm text-gray-500 sm:mt-0">
            Revisit the pre-loved pieces you’ve purchased and leave a review.
          </p>
        </div>

        <div class="mt-4 sm:mt-0 w-full sm:w-64 border-b border-gray-300 py-1 flex items-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search orders or pieces"
            aria-label="Search orders or pieces"
            class="w-full bg-transparent py-2 text-sm focus:outline-none placeholder-gray-400"
          />
        </div>
      </div>

      <div class="mb-8 flex gap-6 border-b border-gray-200 pb-2 text-sm tracking-wide">
        <button
          v-for="status in ['All Orders']"
          :key="status"
          @click="activeFilter = status"
          :class="[
            'pb-2 transition-all relative font-light',
            activeFilter === status
              ? 'font-medium text-black border-b-2 border-black -mb-2.5'
              : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          {{ status }}
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-black" role="status" aria-label="Loading order history"></div>
      </div>

      <div v-else-if="order.error" class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
        {{ order.error }}
      </div>

      <div v-else class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        
        <div v-if="filteredOrders.length === 0" class="lg:col-span-12 text-center py-20 bg-white rounded-lg border border-gray-200 text-gray-400 font-light tracking-wide">
          No past orders match your search.
        </div>

        <section v-else class="lg:col-span-12 space-y-6">
          <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg border border-gray-200">
            <ul class="divide-y divide-gray-200">
              <li v-for="item in filteredOrders" :key="item.id" class="p-4 sm:p-6 group transition-colors hover:bg-gray-50/50">
                
                <div class="flex flex-wrap justify-between items-baseline text-xs tracking-widest uppercase text-gray-500 pb-3 mb-4 border-b border-gray-100">
                  <div class="flex gap-6 flex-wrap">
                    <div>
                      <span class="text-gray-400">Product /</span> {{ item.name }}
                    </div>
                    <div>
                      <span class="text-gray-400">Order ID /</span>
                      <span class="font-mono text-black font-medium">{{ item.id }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Order Date /</span>
                      <span class="font-mono text-black font-medium">{{ formatDate(item.created_at)  }}</span>
                    </div>
                  </div>
                  <div>
                    <span class="text-gray-400">Total /</span>
                    <span class="text-black font-semibold">₱{{ Number(item.total).toFixed(2) }}</span>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div class="flex gap-6">
                    <div class="w-20 h-24 bg-gray-50 border border-gray-100 shrink-0 overflow-hidden grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300 rounded-md">
                      <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 text-[10px] tracking-widest text-gray-300">
                        NO IMAGE
                      </div>
                    </div>

                    <div class="flex flex-col justify-between py-1">
                      <div>
                        <h3 class="text-sm font-medium tracking-wide uppercase text-gray-900">{{ item.name }}</h3>
                        <p class="text-xs text-gray-400 tracking-wide mt-1">
                          Qty: {{ item.quantity }}
                        </p>
                      </div>
                      <div class="mt-2 sm:mt-0">
                        <span class="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-700">
                          {{ item.status }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex sm:flex-col items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 justify-between">
                    <div v-if="item.my_rating"
                      class="text-xs tracking-widest uppercase border border-gray-200 bg-gray-50 text-black px-4 py-2 w-full sm:w-36 text-center rounded-md"
                    >
                      <Star v-for="star in 5" :key="star" :size="15" :fill="star <= item.my_rating ? 'currentColor' : 'none'" :class="star <= item.my_rating ? 'text-amber-500' : 'text-gray-300'" aria-hidden="true" />
                    </div>
                    
                    <button 
                      v-else
                      class="text-xs tracking-widest uppercase border border-gray-300 bg-white text-gray-700 px-4 py-2 hover:border-black hover:text-black transition-colors w-full sm:w-36 text-center rounded-md font-medium cursor-pointer"
                      @click="openRatingModal(item.product_id)"
                    >
                      Rate Product
                    </button>

                    <button  
                      @click="openOrderDetails(item.id)"
                      class="text-xs tracking-widest uppercase border border-gray-300 bg-white text-gray-700 px-4 py-2 hover:border-black hover:text-black transition-colors w-full sm:w-36 text-center rounded-md font-medium cursor-pointer">
                      View details
                    </button>
                  </div>
                </div>

              </li>
            </ul>
          </div>
        </section>

      </div>

      <orderDetailsModal v-if="showModal" :order-id="selectedOrderId" @close="showModal = false" />
      <orderRatingModal v-if="showRatingModal" :product-id="selectedProductId" @close="showRatingModal = false" />

    </div>
  </div>
</template>