<script setup>
import { orderStore } from '@/stores/orders';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import ProductDetailsModal from './productDetailsModal.vue';
import { useProductStore } from '@/stores/products';
import Swal from 'sweetalert2'

const { item } = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// this is for order details
const emit = defineEmits(['viewDetails', 'confirmed'])

function openDetails() {
  emit('viewDetails', item.id)
}

const isConfirming = ref(false)

const canConfirm = () => item.status === 'Delivered'

async function confirmReceived() {
  const result = await Swal.fire({
    title: 'Confirm order received?',
    text: 'Only confirm if the item has been delivered and received.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, confirm',
    cancelButtonText: 'Not yet'
  })

  if (!result.isConfirmed) return

  isConfirming.value = true

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/User/orders/${item.id}/confirm-received`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to confirm order')
    }

    await Swal.fire({
      title: 'Confirmed',
      text: 'Order has been moved to history.',
      icon: 'success',
      confirmButtonText: 'Okay'
    })

    emit('confirmed')
  } catch (error) {
    await Swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'Okay'
    })
  } finally {
    isConfirming.value = false
  }
}

const selectedProduct = ref(null)
const productStore = useProductStore()

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchUserProducts()
  }
})

function showDetails(orderItem) {
  const freshProduct = productStore.products.find(p => p.id === orderItem.product_id)
  if (freshProduct) {
    selectedProduct.value = freshProduct
  } else {
    console.warn(`Product ${orderItem.product_id} not found, using order data`)
    selectedProduct.value = {
      ...orderItem,
      id: orderItem.product_id
    }
  }
}

const order = orderStore()

// this is for Cancel Order
const isLoading = ref(false);
const errorMessage = ref(null);
const router = useRouter();

const canCancel = () => {
  const cancellableStatuses = ['Pending', 'Processing'];
  return cancellableStatuses.includes(item.status);
}

async function cancelOrder() {
  const result = await Swal.fire({
    title: 'Cancel order?',
    text: 'Are you sure you want to cancel this order?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, cancel it'
  }) 

  if (!result.isConfirmed) return

  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/User/orders/${item.id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel order');
    }

    await response.json();

    await Swal.fire({
      title: 'Cancelled',
      text: 'Order cancelled successfully.',
      icon: 'success',
      confirmButtonText: 'Okay'
    })

    router.go(0);
  } catch (error) {
    errorMessage.value = error.message;

    await Swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'Okay'
    })
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>

  <li class="flex py-6 px-4 sm:px-6 sm:py-8 hover:bg-gray-50 transition-colors duration-150">
    <!-- Image -->
    <div class="shrink-0">
      <img 
        :src="item.image" 
        :alt="item.name" 
        class="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-center object-cover border border-gray-200 bg-white" 
      />
    </div>

    <!-- Details Container -->
    <div class="ml-4 sm:ml-6 flex-1 flex flex-col justify-between">
      <div class="relative sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
        
        <!-- Product Info -->
        <div>
          <div class="flex justify-between">
            <h3 class="text-base font-medium text-gray-900">
              <RouterLink :to="`/shop/${item.id}`" class="hover:text-indigo-600 transition-colors">
                {{ item.name }}
              </RouterLink>
            </h3>
          </div>
          <p v-if="item.color" class="mt-1 text-sm text-gray-500">{{ item.color }}</p>
          <p class="mt-1 text-sm font-medium text-gray-900">₱{{ Number(item.price).toFixed(2) }}</p>
          <p class="text-sm text-gray-500">
            Size: <span class="font-medium">{{ item.size_name || 'N/A' }}</span>
          </p>
        </div>

        <!-- Order Status & Quantity -->
        <div class="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
          <!-- Status Badge -->
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
            <!-- Assuming your data has an item.status, otherwise defaulting to 'Processing' -->
            {{ item.status || 'Processing' }}
          </span>
          <p class="text-sm text-gray-600">Qty: <span class="font-medium text-gray-900">{{ item.quantity }}</span></p>
        </div>

      </div>
      
      <!-- Footer: Actions & Total -->
      <div class="mt-4 flex items-center justify-between text-sm border-t border-gray-100 pt-4">
        <!-- Quick Actions -->
        <div class="flex space-x-4">
          <button 
            v-if="canCancel()"
            @click="cancelOrder"
            :disabled="isLoading"
            class="font-medium text-red-600 hover:text-red-900 hover:cursor-pointer transition-colors disabled:opacity-50">
            {{ isLoading ? 'Cancelling...' : 'Cancel Order' }}
          </button>
          <button 
            v-else
            disabled
            class="font-medium text-gray-400 cursor-not-allowed"
            title="Cannot cancel orders that are being delivered or completed"
            >
            Cannot Cancel
          </button>
          <button
            v-if="item.status === 'Delivered'"
            @click="confirmReceived"
            :disabled="isConfirming"
            class="hover:cursor-pointer font-medium text-green-600 hover:text-green-900 transition-colors disabled:opacity-50">
            {{ isConfirming ? 'Confirming...' : 'Confirm Received' }}
          </button>
          
          <button @click="openDetails" class="hover:cursor-pointer font-medium text-indigo-600 hover:text-black transition-colors">
            View Details
          </button>
          <span class="text-gray-300" aria-hidden="true">|</span>
          <button @click="showDetails(item)" class="hover:cursor-pointer hover:text-black  font-medium text-indigo-600 transition-colors">
            Buy Again
          </button>
        </div>
        
        <!-- Line Total -->
        <p class="font-medium text-gray-900 text-right">
          <span class="text-gray-500 font-normal mr-1">Total:</span>
          ₱{{ (Number(item.total) * Number(item.quantity)).toFixed(2) }}
        </p>
      </div>

      <!-- Modal -->
      <ProductDetailsModal
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="selectedProduct = null" /> 
      
    </div>
  </li>
</template>