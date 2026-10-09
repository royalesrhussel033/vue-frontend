<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()

const auth = useAuthStore()
const router = useRouter()

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue', 'switch-to-login'])

const form = reactive({
  first_name: '',
  last_name: '',
  gender: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipcode: '',
  country: ''
})

const submitForm = async () => {
  const result = await auth.register(form)
  if (result) {
    toast.success('Account Registered!')
    emit('update:modelValue', false) // close card
    await router.push({ name: 'home' })
  }
}
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)"></div>

    <!-- Card -->
    <div
      class="relative z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 border-b pb-3">
        <h3 class="text-lg font-semibold">Register</h3>
        <button @click="$emit('update:modelValue', false)" class="hover:cursor-pointer">✕</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm">
    <div class="grid gap-6 mb-3 md:grid-cols-2">
        <div>
            <label for="first_name" class="block mb-2.5 text-sm font-medium text-heading">First name</label>
            <input v-model="form.first_name" type="text" id="first_name" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="John"/>
            <span class="text-red-500" v-if="auth.errors.first_name">{{ auth.errors.first_name[0] }}</span>
        </div>

        <div>
            <label for="last_name" class="block mb-2.5 text-sm font-medium text-heading">Last name</label>
            <input v-model="form.last_name" type="text" id="last_name" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Doe"/>
            <span class="text-red-500" v-if="auth.errors.last_name">{{ auth.errors.last_name[0] }}</span>
        </div>

        <div>
            <label for="gender" class="block mb-2.5 text-sm font-medium text-heading">Gender (Optional)</label>
            <input v-model="form.gender" type="text" id="gender" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Male/Female"/>
            <span class="text-red-500" v-if="auth.errors.gender">{{ auth.errors.gender[0] }}</span>
        </div>

        <div>
            <label for="email" class="block mb-2.5 text-sm font-medium text-heading">Email</label>
            <input v-model="form.email" type="email" id="email" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="JohnDoe@gmail.com"/>
            <span class="text-red-500" v-if="auth.errors.email">{{ auth.errors.email[0] }}</span>
        </div>

        <div>
            <label for="password" class="block mb-2.5 text-sm font-medium text-heading">Password</label>
            <input v-model="form.password" type="password" id="password" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="•••••••••"/>
            <span class="text-red-500" v-if="auth.errors.password">{{ auth.errors.password[0] }}</span>
        </div>

        <div>
            <label for="phone" class="block mb-2.5 text-sm font-medium text-heading">phone</label>
            <input v-model="form.phone" type="text" id="phone" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="0912-345-6789"/>
            <span class="text-red-500" v-if="auth.errors.phone">{{ auth.errors.phone[0] }}</span>
        </div>

        <div>
            <label for="address" class="block mb-2.5 text-sm font-medium text-heading">Address</label>
            <input v-model="form.address" type="text" id="address" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="123 Magsaysay St, Brgy 123"/>
            <span class="text-red-500" v-if="auth.errors.address">{{ auth.errors.address[0] }}</span>
        </div>

        <div>
            <label for="city" class="block mb-2.5 text-sm font-medium text-heading">City</label>
            <input v-model="form.city" type="text" id="city" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Makati City"/>
            <span class="text-red-500" v-if="auth.errors.city">{{ auth.errors.city[0] }}</span>
        </div>

        <div>
            <label for="state" class="block mb-2.5 text-sm font-medium text-heading">State</label>
            <input v-model="form.state" type="text" id="state" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Metro Manila"/>
            <span class="text-red-500" v-if="auth.errors.state">{{ auth.errors.state[0] }}</span>
        </div>

        <div>
            <label for="zipcode" class="block mb-2.5 text-sm font-medium text-heading">Zipcode</label>
            <input v-model="form.zipcode" type="text" id="zipcode" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="1805"/>
            <span class="text-red-500" v-if="auth.errors.zipcode">{{ auth.errors.zipcode[0] }}</span>
        </div>

        <div>
            <label for="country" class="block mb-2.5 text-sm font-medium text-heading">Country</label>
            <input v-model="form.country" type="text" id="country" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Philippines"/>
            <span class="text-red-500" v-if="auth.errors.country">{{ auth.errors.country[0] }}</span>
        </div>
    </div>
    <button type="submit" :disabled="auth.loading" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition cursor-pointer">Register</button>
</form>
      <button @click="$emit('switch-to-login')" class="mt-5 px-50 text-sm text-blue-600 hover:underline cursor-pointer">
            Already have an account? Login
        </button>
    </div>
  </div>
</template>