<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps(['items'])

const subtotal = computed(() => props.items.reduce((acc, i) => acc + (i.price * i.quantity), 0))
const shipping = computed(() => subtotal.value > 0 ? 0 : 0)
const tax = computed(() => subtotal.value * 0)
const total = computed(() => subtotal.value + shipping.value + tax.value)
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-8">
    <h2 class="border-b border-gray-100 pb-4 text-lg font-semibold text-gray-900">Your total</h2>

    <dl class="mt-6 space-y-4">
      <div class="flex items-center justify-between">
        <dt class="text-sm text-gray-600">Subtotal</dt>
        <dd class="text-sm font-medium text-gray-900">₱{{ subtotal.toFixed(2) }}</dd>
      </div>
      <div class="flex items-center justify-between border-t border-gray-100 pt-4">
        <dt class="flex items-center text-sm text-gray-600">
          <span>Shipping</span>
        </dt>
        <dd class="text-sm font-medium text-gray-900">
          {{ shipping === 0 ? 'Free' : '₱' + shipping.toFixed(2) }}
        </dd>
      </div>
      <div class="flex items-center justify-between border-t border-gray-100 pt-4">
        <dt class="text-sm text-gray-600">Tax</dt>
        <dd class="text-sm font-medium text-gray-900">₱{{ tax.toFixed(2) }}</dd>
      </div>
      <div class="flex items-center justify-between border-t border-gray-100 pt-4 text-lg font-bold text-gray-900">
        <dt>Order total</dt>
        <dd>₱{{ total.toFixed(2) }}</dd>
      </div>
    </dl>

    <RouterLink :to="{ name: 'checkOut' }" class="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-transparent bg-black px-4 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-[0.98]">
      Continue to checkout
    </RouterLink>

    <div class="mt-6 text-center text-sm text-gray-500">
      <p>Still browsing? <RouterLink :to="{ name: 'shop' }" class="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600">Find another piece</RouterLink></p>
    </div>
  </div>
</template>