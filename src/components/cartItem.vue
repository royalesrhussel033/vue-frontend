<script setup>
import Swal from 'sweetalert2'
import { useCartStore } from '@/stores/cart';
import { Check, Minus, Plus, X } from '@lucide/vue'

defineProps(['item'])
defineEmits(['update', 'remove'])

const cart = useCartStore()

const confirmRemove = async (id) => {
  const result = await Swal.fire({
    title: 'Remove this piece?',
    text: 'It will be taken out of your shopping bag.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Remove piece',
    cancelButtonText: 'Keep it'
  })

  if (result.isConfirmed) {
    try {
      await cart.removeCartItem(id)
      await Swal.fire({
        title: 'Removed from your bag',
        text: 'This piece is no longer in your cart.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      await Swal.fire({
        title: 'Couldn’t remove this piece',
        text: error.response?.data?.message || 'Please refresh your bag and try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }
  }
}
</script>

<template>
  <li class="flex py-6 sm:py-10">
    <div class="shrink-0">
      <img :src="item.image" :alt="item.name" class="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-center object-cover border border-gray-100" />
    </div>

    <div class="ml-4 sm:ml-6 flex-1 flex flex-col justify-between">
      <div class="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
        <div>
          <div class="flex justify-between">
            <h3 class="text-sm">
              <span class="font-medium text-gray-900">{{ item.name }}</span>
            </h3>
          </div>
          <p  class="mt-1 text-sm font-semibold text-gray-900">₱{{ item.price.toFixed(2) }}</p>
          <p class="text-sm text-gray-500">
            Size: <span class="font-medium">{{ item.size_name || 'N/A' }}</span>
          </p>
        </div>

        <div class="mt-4 sm:mt-0 sm:pr-9">
          <div class="flex items-center space-x-3 border border-gray-300 w-max rounded-md px-2 py-1">
            <button @click="$emit('update', item.id, -1)" :aria-label="`Decrease ${item.name} quantity`" class="px-1 text-gray-500 hover:text-black"><Minus :size="15" /></button>
            <span class="text-sm font-medium w-4 text-center">{{ item.quantity }}</span>
            <button @click="$emit('update', item.id, 1)" :aria-label="`Increase ${item.name} quantity`" class="px-1 text-gray-500 hover:text-black"><Plus :size="15" /></button>
          </div>

          

          <div class="absolute top-0 right-0">
            <button @click="confirmRemove(item.id)" :aria-label="`Remove ${item.name} from your bag`" class="inline-flex p-2 text-gray-400 hover:text-gray-700">
              <X :size="18" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      
      <p class="mt-4 flex text-sm text-gray-700 space-x-2">
        <Check class="shrink-0 text-emerald-700" :size="19" aria-hidden="true" />
        <span>A pre-loved piece selected just for you</span>
      </p>
    </div>
  </li>
</template>