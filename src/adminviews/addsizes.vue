<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { api } from '@/lib/api'
import AdminSidebar from '@/components/adminSidebar.vue'
import { LoaderCircle } from '@lucide/vue'

const toast = useToast()
const router = useRouter()
const loading = ref(false)

const form = reactive({
  name: ''
})

const submitForm = async () => {
  if (loading.value) return
  loading.value = true

  try {
    await api.post('/Admin/storeAdminSizes', { name: form.name })
    toast.success('Size option added.')
    router.back()
  } catch (error) {
    const message =
      error.response?.data?.errors?.name?.[0] ||
      error.response?.data?.message ||
      'We couldn’t add this size. Please try again.'
    toast.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminSidebar>
  <div class="mx-4 my-6 max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:mx-auto sm:my-8 lg:p-8">
    <div class="mb-8 border-b border-gray-100 pb-4">
      <h1 class="text-2xl font-bold text-gray-900">Add a size option</h1>
      <p class="text-sm text-gray-500 mt-1">
        Add a size option for the pieces in your catalog.
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
          :disabled="loading"
          class="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LoaderCircle v-if="loading" :size="15" class="mr-1 inline animate-spin" aria-hidden="true" />
          {{ loading ? 'Adding size…' : 'Add Size' }}
        </button>
      </div>
    </form>
  </div>
  </AdminSidebar>
</template>