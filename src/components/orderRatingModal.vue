<script setup>
import { ref, watch, computed } from 'vue'
import { api } from '@/lib/api'
import { orderStore } from '@/stores/orders'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  productId: { type: [String, Number], required: true }
})

const emit = defineEmits(['close'])

const store = orderStore()

const rating = ref(5)
const comment = ref('')
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const canRate = computed(() => {
  return !!props.productId
})

watch(
  () => props.productId,
  () => {
    rating.value = 5
    comment.value = ''
    successMessage.value = ''
    errorMessage.value = ''
  },
  { immediate: true }
)

async function submitRating() {
  if (!canRate.value) return

  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await api.post(`/User/products/${props.productId}/rating`, {
      rating: rating.value,
      comment: comment.value
    })

    toast.success('Your review has been submitted successfully.')
    comment.value = ''

    setTimeout(() => {
      emit('close')
    }, 800)
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to save rating.'
    errorMessage.value = message

    toast.error(message)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Rate Product</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-black text-2xl leading-none hover:cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div class="p-6 space-y-5">
        <div>
          <p class="text-sm text-gray-500 mb-2">How would you rate this product?</p>
          <div class="flex items-center gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="rating = star"
              class="text-3xl leading-none transition hover:cursor-pointer"
              :class="star <= rating ? 'text-yellow-500' : 'text-gray-300'"
            >
              ★
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
          <textarea
            v-model="comment"
            rows="4"
            placeholder="Leave an optional comment"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="submitRating"
            :disabled="submitting"
            class="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50 hover:cursor-pointer"
          >
            {{ submitting ? 'Saving...' : 'Submit Rating' }}
          </button>

          <p v-if="successMessage" class="text-sm text-green-600">
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="text-sm text-red-600">
            {{ errorMessage }}
          </p>
        </div>

        
      </div>
    </div>
  </div>
</template>