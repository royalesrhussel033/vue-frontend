<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { api } from '@/lib/api'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(false)
const errors = ref([])
const form = reactive({
  email: String(route.query.email ?? ''),
  token: String(route.query.token ?? ''),
  password: '',
  password_confirmation: '',
})

const submit = async () => {
  errors.value = []
  loading.value = true

  try {
    const response = await api.post('/Guest/password/reset', form)
    toast.success(response.data.message)
    await router.push({ name: 'home' })
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = Object.values(error.response.data.errors).flat()
    } else if (error.response?.data?.message) {
      errors.value = [error.response.data.message]
    } else {
      errors.value = ['Unable to reset your password. Please request a new link.']
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-semibold text-gray-900">Choose a new password</h1>
      <p class="mt-2 text-sm text-gray-600">Your reset link can only be used once and expires after a limited time.</p>

      <ul v-if="errors.length" class="mt-5 space-y-1 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label for="reset-email" class="mb-2 block text-sm font-medium">Email address</label>
          <input id="reset-email" v-model.trim="form.email" type="email" required autocomplete="email" class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label for="new-password" class="mb-2 block text-sm font-medium">New password</label>
          <input id="new-password" v-model="form.password" type="password" required minlength="9" autocomplete="new-password" class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label for="confirm-new-password" class="mb-2 block text-sm font-medium">Confirm new password</label>
          <input id="confirm-new-password" v-model="form.password_confirmation" type="password" required minlength="9" autocomplete="new-password" class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" :disabled="loading || !form.token" class="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60">
          {{ loading ? 'Updating…' : 'Update password' }}
        </button>
        <p v-if="!form.token" class="text-sm text-red-600">This reset link is incomplete. Request a new link from sign in.</p>
      </form>
    </div>
  </section>
</template>
