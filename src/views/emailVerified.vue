<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

onMounted(() => {
  auth.openLoginModal = true
  auth.isRegister = false
})
</script>

<template>
  <section class="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
      <h1 class="text-2xl font-semibold text-gray-900">Email verified</h1>
      <p class="mt-3 text-sm leading-6 text-gray-600">
        Your email address is verified. You can now sign in to your account.
      </p>
      <button
        class="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        @click="auth.openLoginModal = true; auth.isRegister = false"
      >
        Sign in
      </button>
    </div>
  </section>
</template>
