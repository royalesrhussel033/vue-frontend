import { defineStore } from 'pinia'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import router from '@/router'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

    

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
                const response = await axios.post('/Guest/register', formData)
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
            const response = await axios.post('/Guest/login', credentials)
            const token = response.data.token;

            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            this.user = response.data.user

            router.push({ name: 'home' });

            return response.data

        } catch (error) {
            if (error.response?.data?.errors) {
                this.errors = Object.values(error.response.data.errors).flat();
            } else if (error.response?.data?.message) {
                this.errors = [error.response.data.message];
            } else {
                this.errors = ['An unexpected error occured. Please try again.'];
            }
        } finally {
            this.loading = false
        }
    },

    async init() {
        this.loading = true
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            try {
                const response = await axios.get('User/home')
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
            const token = localStorage.getItem('token')
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }

            await axios.post('/User/logout')

            // clear local state after succeful logout

            this.user = null
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']

            // redirect to guest home
            router.push({ name: 'home'})
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message)
        }
    }
    }
})

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})