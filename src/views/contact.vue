<script setup>
import { ref } from 'vue';
import { api } from '@/lib/api'
import Swal from 'sweetalert2'



const form = ref({
  name: '',
  email: '',
  message: ''
})

const errors = ref({})
const loading = ref(false)

async function submitConcern() {
  errors.value = {}
  loading.value = true

  try {
    const response = await api.post('/Guest/Concern', form.value)
    await Swal.fire({
      title: 'Sent',
      text: response.data.message || 'Your message has been sent successfully.',
      icon: 'success',
      confirmButtomText: 'Okay'
    })

    form.value = {
      name: '',
      email: '',
      message: '',
    }
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      await Swal.fire({
        title: 'Error',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <section class="bg-white py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
    <div class="max-w-lg w-full space-y-8">
      
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          Contact Us
        </h2>
        <p class="mt-4 text-sm text-gray-600">
          Have a question about your order or our collections? Send us a message and our support team will get back to you shortly.
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="submitConcern">
        <div class="space-y-5">
          
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div class="mt-1">
              <input 
                id="name" 
                v-model.trim="form.name"
                type="text" 
                required 
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition duration-150 ease-in-out" 
                :class="errors.name ? 'border-red-500' : 'border-gray-300'"
                placeholder="Jane Doe"
              >
            </div>
            <p v-if="errors.name" class="mt-2 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div class="mt-1">
              <input 
                id="email" 
                v-model.trim="form.email"
                type="email" 
                required 
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition duration-150 ease-in-out" 
                :class="errors.email ? 'border-red-500' : 'border-gray-300'"
                placeholder="jane@example.com"
              >
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">
              {{ errors.email[0] }}
            </p>
          </div>

          <div>
            <label for="concern" class="block text-sm font-medium text-gray-700">
              Your Concern
            </label>
            <div class="mt-1">
              <textarea 
                id="concern" 
                v-model.trim="form.message" 
                rows="5" 
                required 
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition duration-150 ease-in-out resize-none" 
                :class="errors.message ? 'border-red-500' : 'border-gray-300'"
                placeholder="How can we help you today?"
              ></textarea>
            </div>
            <p v-if="errors.message" class="mt-2 text-sm text-red-600">
              {{ errors.message[0] }}
            </p>
          </div>

        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out hover:cursor-pointer"
          >
            
            {{ loading ? 'Sending...' : 'Send Message' }}
          </button>
        </div>
      </form>
      
    </div>
  </section>
</template>