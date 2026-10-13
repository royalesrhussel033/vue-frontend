<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()
const error = ref('')
const messages = {
  account_link_required: 'An account with this email already exists. Sign in with its password; accounts are not linked automatically.',
  google_email_changed: 'The Google account email has changed. Sign in with your existing account or contact support.',
  google_unavailable: 'Google sign-in is not configured yet.',
  google_sign_in_unavailable: 'Google sign-in is temporarily unavailable. Please try again.',
  google_sign_in_failed: 'Google sign-in could not be completed. Please try again.',
  invalid_google_identity: 'Google could not verify this sign-in. Please try again.',
  invalid_oauth_state: 'This sign-in request expired or could not be verified. Please try again.',
}

onMounted(async () => {
  const parameters = new URLSearchParams(route.hash.slice(1))
  const code = parameters.get('code')
  const providerError = parameters.get('error')
  window.history.replaceState({}, document.title, route.path)

  if (code) {
    const result = await auth.completeGoogleLogin(code)
    if (!result) error.value = auth.errors[0] || messages.google_sign_in_failed
    return
  }

  error.value = messages[providerError] || messages.google_sign_in_failed
})
</script>

<template>
  <main class="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-6 text-center">
    <p v-if="auth.loading" class="text-slate-600 dark:text-slate-300">Completing sign-in…</p>
    <template v-else-if="error">
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Google sign-in unsuccessful</h1>
      <p class="mt-3 text-slate-600 dark:text-slate-300">{{ error }}</p>
      <button
        type="button"
        class="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        @click="auth.openLoginModal = true"
      >
        Return to sign in
      </button>
    </template>
  </main>
</template>
