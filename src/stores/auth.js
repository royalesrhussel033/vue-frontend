import { defineStore } from 'pinia'
import { api } from '@/lib/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    errors: [],
    loading: false,
    initialized: false,
    openLoginModal: false,
    isRegister: false,
  }),

  actions: {
    async register(formData) {
      this.errors = []
      this.loading = true

      try {
        const response = await api.post('/Guest/register', formData)
        this.user = response.data.user ?? null
        return response.data
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          this.errors = []
        }
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.errors = []
      this.loading = true

      try {
        const response = await api.post('/Guest/login', credentials)
        const token = response.data.token

        localStorage.setItem('token', token)
        this.user = response.data.user

        router.push({ name: 'home' })
        return response.data
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = Object.values(error.response.data.errors).flat()
        } else if (error.response?.data?.message) {
          this.errors = [error.response.data.message]
        } else {
          this.errors = ['An unexpected error occured. Please try again.']
        }
      } finally {
        this.loading = false
      }
    },

    async init() {
      this.loading = true
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const response = await api.get('/User/home')
          this.user = response.data.user
        } catch {
          this.user = null
          localStorage.removeItem('token')
        }
      }

      this.initialized = true
      this.loading = false
    },

    async logout() {
      try {
        await api.post('/User/logout')
      } catch (error) {
        console.error('Logout failed:', error.response?.data || error.message)
      } finally {
        this.user = null
        localStorage.removeItem('token')
        router.push({ name: 'home' })
      }
    }
  }
})