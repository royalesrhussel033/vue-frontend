<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { api } from '@/lib/api'

const route = useRoute()
const verifying = ref(true)
const verified = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const { id, hash, expires, signature } = route.query
  const values = [id, hash, expires, signature]

  if (values.some(value => typeof value !== 'string' || !value)) {
    errorMessage.value = 'This verification link is invalid or incomplete. Request a new verification email and try again.'
    verifying.value = false
    return
  }

  try {
    await api.get(`/Guest/email/verify/${encodeURIComponent(id)}/${encodeURIComponent(hash)}`, {
      params: { expires, signature }
    })
    verified.value = true
  } catch (error) {
    errorMessage.value = error.response?.data?.message
      || 'We could not verify this email. The link may have expired or already been used. Request a new verification email and try again.'
  } finally {
    verifying.value = false
  }
})
</script>

<template>
  <section class="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
      <h1 class="text-2xl font-semibold text-gray-900">
        {{ verifying ? 'Verifying email…' : verified ? 'Verification complete' : 'Verification failed' }}
      </h1>
      <p v-if="verifying" class="mt-3 text-sm leading-6 text-gray-600">
        Please wait while we verify your email address.
      </p>
      <div v-else-if="verified" class="mt-3">
        <p class="text-sm leading-6 text-gray-600">
          Your email is verified. You’re all set to sign in and keep exploring.
        </p>
        <RouterLink :to="{ name: 'home' }" class="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800">
          Back to the shop
        </RouterLink>
      </div>
      <p v-else class="mt-3 text-sm leading-6 text-red-700" role="alert">
        {{ errorMessage }}
      </p>
    </div>
  </section>
</template>
