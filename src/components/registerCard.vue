<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()
const auth = useAuthStore()
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'switch-to-login'])

const form = reactive({
  email: '',
  password: '',
  password_confirmation: '',
})

const submitForm = async () => {
  const result = await auth.register(form)

  if (result) {
    toast.success(result.message)
    emit('switch-to-login')
  }
}
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)"></div>

    <div
      class="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6 border-b pb-3">
        <div>
          <h3 id="register-title" class="text-lg font-semibold">Create your account</h3>
          <p class="mt-1 text-sm text-slate-500">Add your delivery details to your profile later.</p>
        </div>
        <button type="button" @click="$emit('update:modelValue', false)" aria-label="Close registration">✕</button>
      </div>

      <ul v-if="auth.errors.length" class="mb-4 space-y-1 text-sm text-red-600" role="alert">
        <li v-for="(error, index) in auth.errors" :key="index">{{ error }}</li>
      </ul>

      <form class="space-y-4" @submit.prevent="submitForm">
        <div>
          <label for="register-email" class="mb-2 block text-sm font-medium">Email address</label>
          <input
            id="register-email"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            required
            maxlength="255"
            class="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@gmail.com"
          />
        </div>

        <div>
          <label for="register-password" class="mb-2 block text-sm font-medium">Password</label>
          <div class="flex">
            <input
              id="register-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              minlength="9"
              class="min-w-0 flex-1 rounded-l-lg border border-slate-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 9 characters"
            />
            <button
              type="button"
              class="rounded-r-lg border border-l-0 border-slate-200 px-3 text-sm text-blue-700"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p class="mt-1 text-xs text-slate-500">Use a password you don’t use on other websites.</p>
        </div>

        <div>
          <label for="register-password-confirmation" class="mb-2 block text-sm font-medium">Confirm password</label>
          <div class="flex">
            <input
              id="register-password-confirmation"
              v-model="form.password_confirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              autocomplete="new-password"
              required
              minlength="9"
              class="min-w-0 flex-1 rounded-l-lg border border-slate-200 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password again"
            />
            <button
              type="button"
              class="rounded-r-lg border border-l-0 border-slate-200 px-3 text-sm text-blue-700"
              :aria-label="showPasswordConfirmation ? 'Hide confirmation' : 'Show confirmation'"
              @click="showPasswordConfirmation = !showPasswordConfirmation"
            >
              {{ showPasswordConfirmation ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="auth.loading"
          class="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ auth.loading ? 'Creating account…' : 'Create account' }}
        </button>
      </form>

      <button @click="$emit('switch-to-login')" class="mt-5 text-sm text-blue-600 hover:underline">
        Already have an account? Sign in
      </button>
    </div>
  </div>
</template>
