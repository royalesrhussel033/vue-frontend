<script setup>
import { Router } from 'lucide-vue-next'
import { computed } from 'vue'
const props = defineProps(['items'])

const subtotal = computed(() => props.items.reduce((acc, i) => acc + (i.price * i.quantity), 0))
const shipping = computed(() => subtotal.value > 0 ? 0 : 0)
const tax = computed(() => subtotal.value * 0)
const total = computed(() => subtotal.value + shipping.value + tax.value)
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-8">
    <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h2>

    <dl class="mt-6 space-y-4">
      <div class="flex items-center justify-between">
        <dt class="text-sm text-gray-600">Subtotal</dt>
        <dd class="text-sm font-medium text-gray-900">₱{{ subtotal.toFixed(2) }}</dd>
      </div>
      <div class="flex items-center justify-between border-t border-gray-100 pt-4">
        <dt class="flex items-center text-sm text-gray-600">
          <span>Shipping estimate</span>
        </dt>
        <dd class="text-sm font-medium text-gray-900">
          {{ shipping === 0 ? 'Free' : '₱' + shipping.toFixed(2) }}
        </dd>
      </div>
      <div class="flex items-center justify-between border-t border-gray-100 pt-4">
        <dt class="text-sm text-gray-600">Tax estimate</dt>
        <dd class="text-sm font-medium text-gray-900">₱{{ tax.toFixed(2) }}</dd>
      </div>
      <div class="flex items-center justify-between border-t border-gray-100 pt-4 text-lg font-bold text-gray-900">
        <dt>Order total</dt>
        <dd>₱{{ total.toFixed(2) }}</dd>
      </div>
    </dl>

    <div class="mt-10">
      <button class="w-full bg-indigo-600 border border-transparent rounded-xl py-4 px-4 text-base font-bold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98]">
        <RouterLink :to="{ name: 'checkOut' }">
          Checkout
        </RouterLink>
        
      </button>
    </div>

    <div class="mt-6 text-center text-sm text-gray-500">
      <p>or <a class="text-indigo-600 font-medium hover:text-indigo-500">
        <RouterLink :to="{ name: 'shop' }">Continue Shopping</RouterLink> </a></p>
    </div>
  </div>
</template>