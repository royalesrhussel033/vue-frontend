<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const toast = useToast()
const router = useRouter()

const form = reactive({
  name: ''
})

const submitForm = async () => {
  try {
    await axios.post('/Admin/storeAdminSizes', { name: form.name })
    toast.success('Size added successfully')
    router.back()
  } catch (error) {
    const message =
      error.response?.data?.errors?.name?.[0] ||
      error.response?.data?.message ||
      'Unable to add size'
    toast.error(message)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8">
    <div class="mb-8 border-b border-gray-100 pb-4">
      <h1 class="text-2xl font-bold text-gray-900">Add New Size</h1>
      <p class="text-sm text-gray-500 mt-1">
        Create a new size option to attach to products.
      </p>
    </div>

    <form @submit.prevent="submitForm">
      <div class="mb-8">
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">
          Size Name
        </label>
        <input
          v-model="form.name"
          id="name"
          type="text"
          placeholder="e.g. Small, Medium, Large"
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>

      <div class="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
        <button
          type="button"
          @click="router.back()"
          class="text-gray-700 bg-white border border-gray-300 rounded-lg text-sm px-5 py-2.5 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-5 py-2.5"
        >
          Add Size
        </button>
      </div>
    </form>
  </div>
</template>