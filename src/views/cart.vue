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
      <h1 class="text-3xl font-bold mb-10 tracking-tight">Shopping Bag</h1>

      <div v-if="items.length > 0" class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div
          v-if="needsDeliveryDetails"
          class="lg:col-span-12 mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          role="alert"
        >
          <p class="font-semibold">Complete your order details before checkout.</p>
          <p class="mt-1">
            Add your name and full delivery details (phone, street address, city, state, postal code, and country) to your profile to order items in your cart.
            <RouterLink :to="{ name: 'profile' }" class="ml-1 font-semibold underline">Fill in your details</RouterLink>
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
        <h2 class="text-xl font-medium text-gray-600">Your bag is empty</h2>
        <RouterLink :to="{ name: 'shop'}">
          <button class="mt-4 text-indigo-600 font-semibold hover:text-indigo-500 hover:cursor-pointer">Continue Shopping →</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>