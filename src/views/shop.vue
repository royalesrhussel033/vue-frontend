<script setup>
import { ref, computed } from "vue"
import { useProductStore } from "@/stores/products"
import { storeToRefs } from "pinia"
import { onMounted } from "vue"
import ProductDetailsModal from '@/components/productDetailsModal.vue'

// Get categories and store it to pinia
const get = useProductStore()
const { products, categories } = storeToRefs(get)

const isLoading = ref(true)

onMounted(async () => {
  await loadShop()
})

async function loadShop() {
  isLoading.value = true
  await Promise.all([get.fetchUserCategories(), get.fetchShopProducts()])
  isLoading.value = false
}

// State
const active = ref("All")
const query = ref("")

// Computed visible products
const visible = computed(() => {
  return products.value
    .filter(p => (active.value === "All" ? true : p.category === active.value))
    .filter(p => p.name.toLowerCase().includes(query.value.toLowerCase()))
})

// Product Details Modal
const selectedProduct = ref(null)

function showDetails(product) {
  selectedProduct.value = product
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50">
    <main class="py-8">
      
      <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            <div>
              <h1 class="text-3xl font-bold tracking-tight text-gray-900">Find your next favorite</h1>
              <p class="mt-1 text-sm text-gray-500">
                {{ visible.length }} {{ visible.length === 1 ? "pre-loved piece" : "pre-loved pieces" }} to explore
              </p>
            </div>

            <div class="relative w-full md:w-80">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                </svg>
              </span>
              <input
                v-model="query"
                type="text"
                placeholder="Search pre-loved clothing"
                aria-label="Search products"
                class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black focus:bg-white transition-all"
              />
            </div>
          </div>

          <div class="h-px bg-gray-100 my-5"></div>

          <div class="flex flex-wrap gap-2">
            <button
              @click="active = 'All'"
              class="cursor-pointer px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-all duration-200"
              :class="active === 'All' 
                ? 'bg-black text-white border-black shadow-sm' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'"
            >
              Shop all
            </button>
            <button
              v-for="c in categories"
              :key="c.id"
              @click="active = c.name"
              class="cursor-pointer px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border transition-all duration-200"
              :class="active === c.name 
                ? 'bg-black text-white border-black shadow-sm' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'"
            >
              {{ c.name }}
            </button>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 py-24 text-center shadow-sm" role="status" aria-live="polite">
          <div class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
          <p class="mt-4 text-sm text-gray-500">Looking for your next great find…</p>
        </div>

        <div v-else-if="get.shopError" class="rounded-2xl border border-red-200 bg-red-50 py-16 text-center shadow-sm" role="alert">
          <h3 class="text-sm font-semibold text-red-900">{{ get.shopError }}</h3>
          <button @click="loadShop" class="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-900 transition hover:bg-red-100">Try again</button>
        </div>

        <div v-else-if="visible.length === 0" class="bg-white rounded-2xl border border-dashed border-gray-300 py-24 text-center shadow-sm">
          <svg  fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mx-auto h-10 w-10 text-gray-400 mb-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h3 class="text-sm font-semibold text-gray-900">No finds match those filters yet</h3>
          <p class="mt-1 text-xs text-gray-500">Try another search or category to uncover more pieces.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <article v-for="p in visible" :key="p.id" class="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
            
            <div class="relative aspect-3/4 w-full overflow-hidden bg-gray-100">
              <img
                :src="p.image"
                :alt="p.name"
                class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <button 
                  @click="showDetails(p)" 
                  class="transform translate-y-2 group-hover:translate-y-0 bg-white text-black text-xs font-semibold uppercase tracking-wider py-3 px-6 rounded-xl shadow-lg hover:bg-black hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>

            <div class="p-4 flex flex-col flex-1 justify-between">
              <div>
                <span class="inline-block text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">
                  {{ p.category }}
                </span>
                <h3 class="text-sm font-medium text-gray-800 group-hover:text-black line-clamp-1 transition-colors">
                  {{ p.name }}
                </h3>
              </div>
              <div class="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span class="text-base font-bold text-gray-900">₱{{ p.price }}</span>
                <button @click="showDetails(p)" class="sm:hidden text-xs text-gray-500 underline font-medium">
                  View Info
                </button>
              </div>
            </div>

          </article>
        </div>
      </section>
    </main>
  </div>

  <ProductDetailsModal 
    v-if="selectedProduct"
    :product="selectedProduct"
    @close="selectedProduct = null" 
  />
</template>