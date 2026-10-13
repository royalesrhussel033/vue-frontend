<script setup>
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useCheckoutStore } from '@/stores/checkout';
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router';
 
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const checkout = useCheckoutStore()
 
/**
 * Generate ONE stable UUID per checkout page visit.
 * If the user clicks "Place Order" 10 times in a row, they all
 * carry this same key — the backend will only process the first one
 * and return the cached result for every subsequent duplicate.
 *
 * A new key is generated on the next page visit (new checkout intent).
 */
const idempotencyKey = ref(crypto.randomUUID())
 
async function handleSubmit() {
    // Layer 1 guard: bail out immediately if a request is already running.
    // This covers fast double-clicks before the :disabled binding kicks in.
    if (checkout.loading) return
 
    if (!cart.items.length) {
        await Swal.fire({
            title: 'Cart is empty',
            text: 'Please add at least one item before checkout.',
            icon: 'warning',
            confirmButtonText: 'Okay'
        })
        return
    }

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
    if (requiredProfileFields.some(field => !auth.user?.[field])) {
        await Swal.fire({
            title: 'Complete your profile',
            text: 'Add your delivery details to your profile before placing an order.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Go to profile',
        }).then(result => {
            if (result.isConfirmed) router.push({ name: 'profile' })
        })
        return
    }
 
    const item = cart.items[0]
    const productId = item.product_id ?? item.product?.id
    const quantity = item.quantity ?? 1
    const payload = {
      delivery_name: `${auth.user.first_name} ${auth.user.last_name}`,
      delivery_address: auth.user.address,
      delivery_phone: auth.user.phone,
      items: cart.items.map(item => ({
        cart_item_id: item.id,
        product_id: item.product_id ?? item.product?.id,
        quantity: item.quantity ?? 1,
        size_id: item.size_id ?? null,
      })),
    }
 
    try {
        // Pass the stable key — every retry attempt uses the SAME key
        await checkout.placeOrder(payload, idempotencyKey.value)
        await Swal.fire({
            title: 'Order placed successfully',
            text: 'Your order has been submitted.',
            icon: 'success',
            confirmButtonText: 'Great'
        })
        await router.push({ name: 'myOrders' })
    } catch {
        await Swal.fire({
            title: 'Checkout failed',
            text: checkout.errors.join(', ') || 'Something went wrong.',
            icon: 'error',
            confirmButtonText: 'Okay'
        })
    }
}
</script>
 
<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col justify-center py-16 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      
      <div class="mb-12 pb-5 border-b border-gray-200">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 uppercase">Checkout</h1>
        <p class="text-xs text-gray-400 uppercase tracking-widest mt-2">Confirm your billing data and finalize your purchase</p>
      </div>
 
      <div class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        
        <div class="lg:col-span-8 space-y-8">
          
          <section class="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm rounded-sm">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-1.5 bg-gray-100 text-gray-800 shrink-0">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 class="text-xs tracking-widest font-bold uppercase text-gray-900">Shipping Address</h2>
            </div>
 
            <div v-if="auth.user" class="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-sm">
              <div class="space-y-1">
                <span class="text-[10px] uppercase tracking-widest text-gray-400 block font-medium">Receiver Name</span>
                <span class="text-gray-900 font-medium text-base capitalize">
                  {{ auth.user.first_name }} {{ auth.user.last_name }}
                </span>
              </div>
 
              <div class="space-y-1">
                <span class="text-[10px] uppercase tracking-widest text-gray-400 block font-medium">Phone Number</span>
                <span class="text-gray-900 font-mono text-base">{{ auth.user.phone }}</span>
              </div>
 
              <div class="sm:col-span-2 space-y-1 pt-3 border-t border-gray-100">
                <span class="text-[10px] uppercase tracking-widest text-gray-400 block font-medium">Delivery Address</span>
                <span class="text-gray-700 text-sm leading-relaxed block mt-0.5">{{ auth.user.address }}</span>
              </div>
            </div>
            
            <div v-else class="text-xs tracking-widest uppercase font-medium text-red-600 bg-red-50 p-4 border border-red-200">
              No user info found. Please log in to complete checkout.
            </div>
          </section>
 
          <section class="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm rounded-sm">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-1.5 bg-gray-100 text-gray-800 shrink-0">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 class="text-xs tracking-widest font-bold uppercase text-gray-900">Payment Method</h2>
            </div>
 
            <div class="border-2 border-black p-4 bg-gray-50/50 flex items-center justify-between">
              <div class="flex items-center gap-3.5">
                <div class="h-4 w-4 rounded-full border border-black flex items-center justify-center shrink-0">
                  <div class="h-2 w-2 rounded-full bg-black"></div>
                </div>
                <span class="text-sm font-semibold uppercase tracking-wider text-gray-900">Cash on Delivery</span>
              </div>
              <span class="text-[10px] font-medium tracking-widest text-gray-400 uppercase bg-white border border-gray-200 px-2 py-0.5">Default</span>
            </div>
          </section>
 
        </div>
 
        <aside class="lg:col-span-4 mt-8 lg:mt-0">
          <div class="bg-white border border-gray-200 p-6 shadow-sm rounded-sm sticky top-8">
            <h2 class="text-xs tracking-widest font-bold uppercase text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Order Summary
            </h2>
            
            <div class="space-y-3 text-xs uppercase tracking-wider mb-6 text-gray-600">
              <div class="flex justify-between">
                <span>Items Selection</span>
                <span class="font-medium text-gray-900 font-mono">{{ cart.items.length }} line item(s)</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping Fee</span>
                <span class="font-medium text-emerald-600">FREE</span>
              </div>
            </div>
 
            <!--
              :disabled="checkout.loading"  → HTML disables the button so it can't be clicked
              disabled:opacity-50           → visual feedback that the button is inactive
              disabled:cursor-not-allowed   → cursor changes to show it's blocked
            -->
            <button
              @click="handleSubmit()"
              :disabled="checkout.loading"
              class="w-full text-xs tracking-widest uppercase font-semibold bg-black text-white py-4
                     hover:bg-gray-800 active:bg-black transition-all duration-150 shadow-md
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black cursor-pointer"
            >
              <span v-if="checkout.loading" class="flex items-center justify-center gap-2">
                <!-- Inline spinner, no extra dependency needed -->
                <svg class="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Processing…
              </span>
              <span v-else>Place Order</span>
            </button>
            
            <p class="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-wide leading-normal">
              By placing this order, you authorize delivery confirmation terms.
            </p>
          </div>
        </aside>
 
      </div>
      
    </div>
  </div>
</template>