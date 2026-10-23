<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { BadgeCheck, Loader, ShoppingBasket, Star, X } from '@lucide/vue'

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
const isOutOfStock = computed(() => Number(props.product?.stock) <= 0)

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
                <Star
                  v-for="i in 5"
                  :key="i"
                  :size="16"
                  :fill="i <= Math.round(product.ratings_avg_rating || 0) ? 'currentColor' : 'none'"
                  :class="i <= Math.round(product.ratings_avg_rating || 0) ? 'text-amber-500' : 'text-gray-200'"
                  aria-hidden="true"
                />
              </div>
              <span v-if="product.ratings_count" class="text-xs font-medium text-gray-500">
                {{ Number(product.ratings_avg_rating || 0).toFixed(1) }} &middot; {{ product.ratings_count || 0 }} reviews
              </span>
              <span v-else class="text-xs font-medium text-gray-500">No reviews yet</span>
            </div>
          </div>

          <div class="flex items-center gap-3 mt-5">
            <span class="text-3xl font-black text-gray-900 tracking-tight">₱{{ product.price }}</span>
            <span v-if="product.originalPrice" class="text-base text-gray-400 line-through font-medium">
              ₱{{ product.originalPrice }}
            </span>
          </div>

          <div class="mt-5 space-y-4">
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ product.description }}
            </p>
            
            <div class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full" :class="product.stock > 5 ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              <span v-if="!isOutOfStock" class="text-gray-500 font-medium">
                {{ Number(product.stock) === 1 ? 'Only 1 piece left' : `${product.stock} pieces left` }}
              </span>
              <span v-else class="font-medium text-red-700">Sold out</span>
            </div>
          </div>

          <div v-if="sizes.length" class="mt-6 space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-900">Choose a size</p>
              <span v-if="sizeError" class="text-xs font-semibold text-red-700" role="alert">
                Choose a size to continue.
              </span>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <button
                v-for="size in sizes"
                :key="size.id"
                @click="selectSize(size.id)"
                :aria-pressed="selectedSizeId === size.id"
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
              :disabled="isAdding || added || isOutOfStock"
              class="w-full h-12 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
              :class="added 
                ? 'bg-emerald-600 text-white shadow-emerald-100' 
                : 'bg-black text-white hover:bg-gray-900 disabled:opacity-70 hover:shadow-md'"
            >
              <Loader v-if="isAdding" class="animate-spin w-4 h-4" />
              <BadgeCheck v-else-if="added" class="w-4 h-4" />
              <ShoppingBasket v-else class="w-4 h-4" />
              
              <span>
                {{ isOutOfStock ? 'Sold out' : isAdding ? 'Adding to your bag…' : added ? 'Added to your bag' : 'Add to bag' }}
              </span>
            </button>
          </div>

          <p class="border-t border-gray-100 pt-4 text-center text-xs leading-5 text-gray-500">
            Every thrifted piece is unique. Check the photos, description, and size before adding it to your bag.
          </p>
        </div>
        
      </div>
    </div>
  </div>
</template>