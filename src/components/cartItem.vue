<script setup>
import Swal from 'sweetalert2'
import { useCartStore } from '@/stores/cart';

defineProps(['item'])
defineEmits(['update', 'remove'])

const cart = useCartStore()

const confirmRemove = async (id) => {
  const result = await Swal.fire({
    title: 'Remove item?',
    text: 'This product will be removed from your cart.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it'
  })

  if (result.isConfirmed) {
    await cart.removeCartItem(id)

    Swal.fire({
      title: 'Removed',
      text: 'Item has been removed from your cart.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
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
              <a href="#" class="font-medium text-gray-700 hover:text-gray-800">{{ item.name }}</a>
            </h3>
          </div>
          <!-- <p class="mt-1 text-sm text-gray-500">{{ item.color }}</p> -->
          <p  class="mt-1 text-sm font-semibold text-gray-900">₱{{ item.price.toFixed(2) }}</p>
          <p class="text-sm text-gray-500">
            Size: <span class="font-medium">{{ item.size_name || 'N/A' }}</span>
          </p>
        </div>

        <div class="mt-4 sm:mt-0 sm:pr-9">
          <div class="flex items-center space-x-3 border border-gray-300 w-max rounded-md px-2 py-1">
            <button @click="$emit('update', item.id, -1)" class="text-gray-500 hover:text-black px-1">-</button>
            <span class="text-sm font-medium w-4 text-center">{{ item.quantity }}</span>
            <button @click="$emit('update', item.id, 1)" class="text-gray-500 hover:text-black px-1">+</button>
          </div>

          

          <div class="absolute top-0 right-0">
            <button @click="confirmRemove(item.id)" class="inline-flex p-2 text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5 hover:cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <p class="mt-4 flex text-sm text-gray-700 space-x-2">
        <svg class="shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span>In stock</span>
      </p>
    </div>
  </li>
</template>