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
    twoFactorChallenge: null,
  }),

  actions: {
    async register(formData) {
      this.errors = []
      this.loading = true

      try {
        const response = await api.post('/Guest/register', formData)
        this.user = null
        return response.data
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = Object.values(error.response.data.errors).flat()
        } else if (error.response?.data?.message) {
          this.errors = [error.response.data.message]
        } else {
          this.errors = ['Unable to create your account. Please try again.']
        }
        return null
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.errors = []
      this.loading = true
      this.user = null
      this.twoFactorChallenge = null

      try {
        const response = await api.post('/Guest/login', credentials)
        if (response.data.two_factor_required) {
          this.twoFactorChallenge = response.data.challenge_token
          return response.data
        }

        const token = response.data.token

        localStorage.setItem('token', token)
        this.user = response.data.user
        this.twoFactorChallenge = null

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
        return null
      } finally {
        this.loading = false
      }
    },

    async completeGoogleLogin(code) {
      this.errors = []
      this.loading = true

      try {
        const response = await api.post('/Guest/oauth/exchange', { code })

        if (response.data.two_factor_required) {
          this.user = null
          this.twoFactorChallenge = response.data.challenge_token
          this.isRegister = false
          this.openLoginModal = true
          await router.push({ name: 'home' })
          return response.data
        }

        localStorage.setItem('token', response.data.token)
        this.user = response.data.user
        this.twoFactorChallenge = null
        await router.push({ name: 'home' })
        return response.data
      } catch (error) {
        this.errors = error.response?.data?.message
          ? [error.response.data.message]
          : ['Unable to complete Google sign-in. Please try again.']
        return null
      } finally {
        this.loading = false
      }
    },

    async verifyTwoFactor(code) {
      this.errors = []
      this.loading = true

      try {
        const response = await api.post('/Guest/two-factor/verify', {
          challenge_token: this.twoFactorChallenge,
          code,
        })
        localStorage.setItem('token', response.data.token)
        this.user = response.data.user
        this.twoFactorChallenge = null
        router.push({ name: 'home' })
        return response.data
      } catch (error) {
        this.errors = error.response?.data?.message
          ? [error.response.data.message]
          : ['Unable to verify the code. Please try again.']
        return null
      } finally {
        this.loading = false
      }
    },

    async resendTwoFactorCode() {
      this.errors = []

      try {
        const response = await api.post('/Guest/two-factor/resend', {
          challenge_token: this.twoFactorChallenge,
        })
        return response.data.message
      } catch (error) {
        this.errors = error.response?.data?.message
          ? [error.response.data.message]
          : ['Unable to resend a code. Please sign in again.']
        return null
      }
    },

    async resendVerification(email) {
      try {
        const response = await api.post('/Guest/email/resend-verification', { email })
        return response.data.message
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = Object.values(error.response.data.errors).flat()
        } else {
          this.errors = ['Unable to process the request. Please try again later.']
        }
        return null
      }
    },

    async requestPasswordReset(email) {
      try {
        const response = await api.post('/Guest/password/forgot', { email })
        return response.data.message
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = Object.values(error.response.data.errors).flat()
        } else {
          this.errors = ['Unable to process the request. Please try again later.']
        }
        return null
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
          this.twoFactorChallenge = null
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
        this.twoFactorChallenge = null
        localStorage.removeItem('token')
        router.push({ name: 'home' })
      }
    }
  }
})