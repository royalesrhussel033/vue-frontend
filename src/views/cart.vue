<script setup>
import CartItem from '@/components/cartItem.vue'
import OrderSummary from '@/components/orderSummary.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const cart = useCartStore()
const auth = useAuthStore()
const { items } = storeToRefs(cart)
const needsDeliveryDetails = computed(() => {
  const requiredProfileFields = [
    'first_name',
    'last_name',
    'phone',
    'address',
    'city',
    'state',
    'zipcode',
    'country',
  ]

  return requiredProfileFields.some(field => !auth.user?.[field]?.trim())
})

onMounted(() => {
  cart.fetchCartItem()
})



const updateQuantity = (id, change) => {
  const item = items.value.find(i => i.id === id)
  if (item) {
    item.quantity = Math.max(1, item.quantity + change)
    items.value = [...items.value]
  }
}

const removeItem = (id) => {
  items.value = items.value.filter(i => i.id !== id)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <h1 class="mb-10 text-3xl font-bold tracking-tight">Your shopping bag</h1>

      <div v-if="cart.isLoading" class="rounded-2xl border border-gray-100 bg-white py-20 text-center" role="status" aria-live="polite">
        <div class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
        <p class="mt-4 text-sm text-gray-500">Gathering your saved pieces…</p>
      </div>

      <div v-else-if="cart.error" class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
        <p>{{ cart.error }}</p>
        <button @click="cart.fetchCartItem()" class="rounded-lg border border-red-300 px-4 py-2 font-medium transition hover:bg-red-100">Try again</button>
      </div>

      <div v-else-if="items.length > 0" class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div
          v-if="needsDeliveryDetails"
          class="lg:col-span-12 mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          role="alert"
        >
          <p class="font-semibold">A few details before you check out</p>
          <p class="mt-1">
            Add your name and delivery address to your profile so we know where to send your finds.
            <RouterLink :to="{ name: 'profile' }" class="ml-1 font-semibold underline">Update your details</RouterLink>
          </p>
        </div>

        <!-- Product List -->
        <section class="lg:col-span-7">
          <ul class="border-t border-b border-gray-200 divide-y divide-gray-200">
            <CartItem 
              v-for="item in items" 
              :key="item.id" 
              :item="item"
              @update="updateQuantity"
              @remove="removeItem"
            />
          </ul>
        </section>

        <!-- Summary -->
        <OrderSummary :items="items" class="lg:col-span-5 mt-16 lg:mt-0" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <h2 class="text-xl font-medium text-gray-900">Your bag is waiting for a great find</h2>
        <p class="mt-2 text-sm text-gray-500">Explore one-of-a-kind pre-loved pieces and see what catches your eye.</p>
        <RouterLink :to="{ name: 'shop'}">
          <span class="mt-5 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">Explore the shop</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>