<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useToast } from 'vue-toastification'
    
    const toast = useToast()
    
    const email = ref('')
    const password = ref('')
    const auth = useAuthStore()
    const props = defineProps({ modelValue: Boolean })
    const emit = defineEmits(['update:modelValue', 'switch-to-register'])

    const handleLogin = async () => {
        await auth.login({
            email: email.value,
            password: password.value
        })

        // if login succeeded and auth.user is set close modal
        if (auth.user) {
            toast.success('Logged in!')
            emit('update:modelValue', false) // <-- close modal
        } else {
            console.log(auth.errors)
        }
    }
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center px-4" @keydown.esc.prevent="$emit('update:modelValue', false)">

    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" aria-hidden="true"></div>
    <!-- Card -->
    <div class="relative z-50 w-full max-w-md bg-white/95 dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden"
                role="dialog"
                arial-modal="true"
                aria-labelledby="login-title"          
    @click.stop>

        <!-- Header -->  

        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
                <h3 id="login-title" class="text-lg font-semibold text-slate-900 dark:text-slate-100">Sign in to your account</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back — enter your details to continue</p>
            </div>
            <button @click="$emit('update:modelValue', false)" class="hover:cursor-pointer">✕</button>
        </div>

        <!-- Body -->
        <div class="px-6 py-1">
            <!-- Errors -->
            <ul v-if="auth.errors.length" class="mb-4 space-y-1 text-sm text-red-600">
                <li v-for="(err, i) in auth.errors" :key="i">{{ err }}</li>
            </ul>
        </div>

        <!-- form here -->
        
        <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
                <div class="relative px-8">
                    <input v-model="email" type="text" id="email" class="w-full px-4 py-4 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Please enter you Email"/>
                </div>
                <div class="relative px-8 py-4">
                    <input v-model="password" type="password" id="password" class="w-full px-4 py-3 pr-12 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Please enter your Password"/>
                </div>
            </div>
            <div class="px-8 pb-5">
                <button type="submit"  class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition cursor-pointer">Login</button>
            </div>
        </form>
        
        <!-- Button to Register or Login again -->
         <button @click="$emit('switch-to-register')" class="mb-5 px-29 text-sm text-blue-600 hover:underline cursor-pointer">
            Don't have an account? Register
        </button>
    </div>
  </div>
</template>