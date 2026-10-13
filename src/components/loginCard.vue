<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()
const email = ref('')
const password = ref('')
const twoFactorCode = ref('')
const mode = ref('login')
const auth = useAuthStore()
defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'switch-to-register'])

watch(() => auth.twoFactorChallenge, (challenge) => {
  if (challenge) mode.value = 'two-factor'
})

const handleLogin = async () => {
  const result = await auth.login({
    email: email.value,
    password: password.value,
  })

  if (result?.two_factor_required) {
    mode.value = 'two-factor'
    toast.info(result.message)
  } else if (result && auth.user) {
    toast.success('Logged in!')
    emit('update:modelValue', false)
  }
}

const handleTwoFactor = async () => {
  const result = await auth.verifyTwoFactor(twoFactorCode.value)
  if (result && auth.user) {
    toast.success('Logged in!')
    emit('update:modelValue', false)
  }
}

const resendTwoFactorCode = async () => {
  const message = await auth.resendTwoFactorCode()
  if (message) toast.info(message)
}

const resendVerification = async () => {
  const message = await auth.resendVerification(email.value)
  if (message) toast.info(message)
}

const requestPasswordReset = async () => {
  const message = await auth.requestPasswordReset(email.value)
  if (message) toast.info(message)
}
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center px-4"
    @keydown.esc.prevent="$emit('update:modelValue', false)"
  >
    <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" aria-hidden="true"></div>
    <div
      class="relative z-50 w-full max-w-md overflow-hidden rounded-2xl bg-white/95 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      @click.stop
    >
      <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div>
          <h3 id="login-title" class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {{ mode === 'login' ? 'Sign in to your account' : mode === 'forgot' ? 'Reset your password' : 'Verify your sign-in' }}
          </h3>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {{ mode === 'login' ? 'Welcome back — enter your details to continue' : mode === 'forgot' ? 'We’ll email a reset link if an account matches.' : 'Enter the six-digit code sent to your verified email.' }}
          </p>
        </div>
        <button type="button" aria-label="Close" @click="$emit('update:modelValue', false)">✕</button>
      </div>

      <ul v-if="auth.errors.length" class="space-y-1 px-8 pt-4 text-sm text-red-600" role="alert">
        <li v-for="(error, index) in auth.errors" :key="index">{{ error }}</li>
      </ul>

      <form v-if="mode === 'login'" class="space-y-4 py-5" @submit.prevent="handleLogin">
        <div class="px-8">
          <label for="login-email" class="sr-only">Email address</label>
          <input
            id="login-email"
            v-model.trim="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Email address"
          />
        </div>
        <div class="px-8">
          <label for="login-password" class="sr-only">Password</label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Password"
          />
        </div>
        <div class="px-8">
          <button
            type="submit"
            :disabled="auth.loading"
            class="w-full cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
          >
            {{ auth.loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </div>
      </form>

      <form v-else-if="mode === 'forgot'" class="space-y-4 py-5" @submit.prevent="requestPasswordReset">
        <div class="px-8">
          <label for="reset-email" class="sr-only">Email address</label>
          <input
            id="reset-email"
            v-model.trim="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email address"
          />
        </div>
        <div class="px-8">
          <button
            type="submit"
            class="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md"
          >
            Send reset link
          </button>
        </div>
      </form>

      <form v-if="mode === 'two-factor'" class="space-y-4 py-5" @submit.prevent="handleTwoFactor">
        <div class="px-8">
          <label for="two-factor-code" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Six-digit code</label>
          <input
            id="two-factor-code"
            v-model="twoFactorCode"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            pattern="[0-9]{6}"
            maxlength="6"
            required
            class="w-full rounded-lg border border-slate-200 bg-white px-4 py-4 text-center text-lg tracking-[0.4em] text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="000000"
          />
        </div>
        <div class="px-8">
          <button
            type="submit"
            :disabled="auth.loading"
            class="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60"
          >
            {{ auth.loading ? 'Verifying…' : 'Verify and sign in' }}
          </button>
        </div>
      </form>

      <div class="flex flex-wrap items-center justify-between gap-3 px-8 pb-6 text-sm">
        <button
          v-if="mode === 'login'"
          type="button"
          class="text-blue-600 hover:underline"
          @click="mode = 'forgot'; auth.errors = []"
        >
          Forgot password?
        </button>
        <button
          v-if="mode === 'login'"
          type="button"
          class="text-blue-600 hover:underline"
          @click="resendVerification"
        >
          Resend verification email
        </button>
        <button
          v-if="mode === 'forgot'"
          type="button"
          class="text-blue-600 hover:underline"
          @click="mode = 'login'; auth.errors = []"
        >
          Back to sign in
        </button>
        <button
          v-if="mode === 'two-factor'"
          type="button"
          class="text-blue-600 hover:underline"
          @click="resendTwoFactorCode"
        >
          Resend code
        </button>
        <button
          v-if="mode === 'two-factor'"
          type="button"
          class="text-blue-600 hover:underline"
          @click="mode = 'login'; twoFactorCode = ''; auth.twoFactorChallenge = null; auth.errors = []"
        >
          Back to sign in
        </button>
        <button
          v-if="mode === 'login'"
          type="button"
          class="text-blue-600 hover:underline"
          @click="$emit('switch-to-register')"
        >
          Create an account
        </button>
      </div>
    </div>
  </div>
</template>
