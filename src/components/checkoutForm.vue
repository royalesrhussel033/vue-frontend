<script setup>
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useCheckoutStore } from '@/stores/checkout';
import { computed, ref } from 'vue';
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router';
import { CreditCard, LoaderCircle, MapPin } from '@lucide/vue'
 
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const checkout = useCheckoutStore()
const deliveryName = computed(() => `${auth.user?.first_name ?? ''} ${auth.user?.last_name ?? ''}`.trim())
const deliveryAddress = computed(() => [
  auth.user?.address,
  auth.user?.city,
  auth.user?.state,
  auth.user?.zipcode,
  auth.user?.country,
].filter(Boolean).join(', '))
 
const idempotencyKey = ref(crypto.randomUUID())
 
async function handleSubmit() {
    if (checkout.loading) return
 
    if (!cart.items.length) {
        await Swal.fire({
            title: 'Your bag is empty',
            text: 'Add a piece to your bag before heading to checkout.',
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
    if (requiredProfileFields.some(field => !auth.user?.[field]?.trim())) {
        await Swal.fire({
            title: 'Add your delivery details',
            text: 'We need your name, phone number, and full address to send this order.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Go to profile',
        }).then(result => {
            if (result.isConfirmed) router.push({ name: 'profile' })
        })
        return
    }
 
    const payload = {
      delivery_name: deliveryName.value,
      delivery_address: deliveryAddress.value,
      delivery_phone: auth.user.phone,
      items: cart.items.map(item => ({
        cart_item_id: item.id,
        product_id: item.product_id ?? item.product?.id,
        quantity: item.quantity ?? 1,
        size_id: item.size_id ?? null,
      })),
    }
 
    try {
        await checkout.placeOrder(payload, idempotencyKey.value)
        await Swal.fire({
            title: 'Order received!',
            text: 'Your order is confirmed. Follow its progress from My Orders.',
            icon: 'success',
            confirmButtonText: 'Great'
        })
        await router.push({ name: 'myOrders' })
    } catch {
        await Swal.fire({
            title: 'We couldn’t place your order',
            text: checkout.errors.join(', ') || 'Please check your connection and try again.',
            icon: 'error',
            confirmButtonText: 'Okay'
        })
    }
}
</script>
 
<template>
  <div class="flex min-h-screen flex-col justify-center bg-stone-50 py-16 text-gray-900 antialiased sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      
      <div class="mb-12 pb-5 border-b border-gray-200">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
        <p class="mt-2 text-sm text-gray-500">Check your delivery details before placing your order.</p>
      </div>
 
      <div class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        
        <div class="lg:col-span-8 space-y-8">
          
          <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="shrink-0 rounded-lg bg-stone-100 p-2 text-stone-800">
                <MapPin :size="18" aria-hidden="true" />
              </div>
              <h2 class="text-xs tracking-widest font-bold uppercase text-gray-900">Shipping Address</h2>
            </div>
 
            <div v-if="auth.user" class="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-sm">
              <div class="space-y-1">
                <span class="text-[10px] uppercase tracking-widest text-gray-400 block font-medium">Receiver Name</span>
                <span class="text-gray-900 font-medium text-base capitalize">
                  {{ deliveryName }}
                </span>
              </div>
 
              <div class="space-y-1">
                <span class="text-[10px] uppercase tracking-widest text-gray-400 block font-medium">Phone Number</span>
                <span class="text-gray-900 font-mono text-base">{{ auth.user.phone }}</span>
              </div>
 
              <div class="sm:col-span-2 space-y-1 pt-3 border-t border-gray-100">
                <span class="text-[10px] uppercase tracking-widest text-gray-400 block font-medium">Delivery Address</span>
                <span class="text-gray-700 text-sm leading-relaxed block mt-0.5">{{ deliveryAddress }}</span>
              </div>
            </div>
            
            <div v-else class="text-xs tracking-widest uppercase font-medium text-red-600 bg-red-50 p-4 border border-red-200">
              We couldn’t find your account details. Sign in to complete checkout.
            </div>
          </section>
 
          <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="shrink-0 rounded-lg bg-stone-100 p-2 text-stone-800">
                <CreditCard :size="18" aria-hidden="true" />
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
              <span class="text-[10px] font-medium tracking-widest text-gray-500 uppercase bg-white border border-gray-200 px-2 py-0.5">Available</span>
            </div>
          </section>
 
        </div>
 
        <aside class="lg:col-span-4 mt-8 lg:mt-0">
          <div class="sticky top-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="text-xs tracking-widest font-bold uppercase text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Order Summary
            </h2>
            
            <div class="space-y-3 text-xs uppercase tracking-wider mb-6 text-gray-600">
              <div class="flex justify-between">
                <span>Pieces</span>
                <span class="font-medium text-gray-900 font-mono">{{ cart.items.length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping Fee</span>
                <span class="font-medium text-emerald-600">FREE</span>
              </div>
            </div>
 
            <button
              @click="handleSubmit()"
              :disabled="checkout.loading"
              class="w-full text-xs tracking-widest uppercase font-semibold bg-black text-white py-4
                     hover:bg-gray-800 active:bg-black transition-all duration-150 shadow-md
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black cursor-pointer"
            >
              <span v-if="checkout.loading" class="flex items-center justify-center gap-2">
                <LoaderCircle :size="15" class="animate-spin" aria-hidden="true" />
                Processing…
              </span>
              <span v-else>Place Order</span>
            </button>
            
            <p class="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-wide leading-normal">
              Pay for your order in cash when it arrives. You can track updates from My Orders.
            </p>
          </div>
        </aside>
 
      </div>
      
    </div>
  </div>
</template>