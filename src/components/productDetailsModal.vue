<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { ShoppingBasket, Loader, BadgeCheck, X, Truck, RotateCcw, ShieldCheck } from '@lucide/vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const emit = defineEmits(['close'])

const cart = useCartStore()
const authStore = useAuthStore()
const qty = ref(1)
const isAdding = ref(false)
const added = ref(false)
const selectedSizeId = ref(null)
const sizeError = ref(false)

const sizes = computed(() => props.product?.sizes || [])
const selectedSizeName = computed(() =>
  sizes.value.find(s => s.id === selectedSizeId.value)?.name || null
)

const selectSize = (id) => {
  selectedSizeId.value = id
  sizeError.value = false
}

const handleAddToCart = async () => {
  if (!authStore.user) {
    emit('close')
    authStore.openLoginModal = true
    authStore.isRegister = false
    return
  }

  if (sizes.value.length && !selectedSizeId.value) {
    sizeError.value = true
    return
  }

  if (isAdding.value) return
  isAdding.value = true
  
  try {
    await cart.addToCart(props.product, qty.value, selectedSizeId.value, selectedSizeName.value)
    added.value = true
    setTimeout(() => {
      added.value = false
    }, 1500)
  } finally {
    isAdding.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 animate-fade-in"
    @click="$emit('close')"
  >
    <div
      class="relative bg-white max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:grid md:grid-cols-2 max-h-[90vh]"
      @click.stop
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md text-gray-700 hover:text-black rounded-full shadow-sm border border-gray-200/50 transition hover:scale-105 cursor-pointer"
        aria-label="Close modal"
      >
        <X :size="18" />
      </button>

      <div class="relative bg-gray-50 flex items-center justify-center min-h-75 md:min-h-full overflow-hidden">
        <img
          :src="product.image"
          alt="Product image"
          class="h-full w-full object-cover aspect-3/4"
        />
        <span class="absolute top-4 left-4 bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-sm">
          New arrival
        </span>
      </div>

      <div class="flex flex-col justify-between overflow-y-auto bg-white p-6 md:p-8">
        <div>
          <div class="space-y-1.5">
            <span class="text-xs font-bold tracking-wider text-gray-400 uppercase">
              {{ product.category }}
            </span>
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
              {{ product.name }}
            </h2>
            
            <div class="flex items-center gap-2 pt-0.5">
              <div class="flex text-amber-400">
                <svg
                  v-for="i in 5"
                  :key="i"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  :class="i <= Math.round(product.ratings_avg_rating || 0) ? 'fill-current' : 'text-gray-200'"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.871 1.402-8.174L.132 9.211l8.2-1.193z"/>
                </svg>
              </div>
              <span class="text-xs font-medium text-gray-500">
                {{ Number(product.ratings_avg_rating || 0).toFixed(1) }} &middot; {{ product.ratings_count || 0 }} reviews
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3 mt-5">
            <span class="text-3xl font-black text-gray-900 tracking-tight">₱{{ product.price }}</span>
            <span v-if="product.originalPrice" class="text-base text-gray-400 line-through font-medium">
              ₱{{ product.originalPrice }}
            </span>
            <span class="bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-red-100">
              Save 20%
            </span>
          </div>

          <div class="mt-5 space-y-4">
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ product.description }}
            </p>
            
            <div class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full" :class="product.stock > 5 ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              <span class="text-gray-500 font-medium">Stock inventory: <b class="text-gray-800">{{ product.stock }} items left</b></span>
            </div>
          </div>

          <div v-if="sizes.length" class="mt-6 space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-900">Select Variant Size</p>
              <span v-if="sizeError" class="text-xs font-semibold text-red-500 animate-pulse">
                Please pick a size option
              </span>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <button
                v-for="size in sizes"
                :key="size.id"
                @click="selectSize(size.id)"
                :class="selectedSizeId === size.id 
                  ? 'bg-black text-white border-black shadow-sm scale-[1.02]' 
                  : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400'"
                class="rounded-xl border px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer"
              >
                {{ size.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 space-y-5">
          <div class="flex items-center gap-3">
            <button
              @click="handleAddToCart"
              :disabled="isAdding || added"
              class="w-full h-12 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
              :class="added 
                ? 'bg-emerald-600 text-white shadow-emerald-100' 
                : 'bg-black text-white hover:bg-gray-900 disabled:opacity-70 hover:shadow-md'"
            >
              <Loader v-if="isAdding" class="animate-spin w-4 h-4" />
              <BadgeCheck v-else-if="added" class="w-4 h-4" />
              <ShoppingBasket v-else class="w-4 h-4" />
              
              <span>
                {{ isAdding ? 'Adding to Bag...' : added ? 'Added to Cart' : 'Add to Basket' }}
              </span>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
            <div class="flex flex-col items-center gap-1">
              <div class="p-2 bg-gray-50 rounded-full text-gray-700">
                <Truck :size="16" />
              </div>
              <span class="text-[11px] font-medium text-gray-500">Free Shipping</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="p-2 bg-gray-50 rounded-full text-gray-700">
                <RotateCcw :size="16" />
              </div>
              <span class="text-[11px] font-medium text-gray-500">30-Day Returns</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <div class="p-2 bg-gray-50 rounded-full text-gray-700">
                <ShieldCheck :size="16" />
              </div>
              <span class="text-[11px] font-medium text-gray-500">Authentic Secure</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>