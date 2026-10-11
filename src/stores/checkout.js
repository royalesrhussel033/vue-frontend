import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { api } from '@/lib/api'
import { defineStore } from 'pinia'




export const useCheckoutStore = defineStore('checkout', {
    state: () => ({
        loading: false,
        errors: [],
        order: null,
    }),

    actions: {
        async placeOrder(payload, idempotencyKey) {
            this.loading = true
            this.errors = []
            
            const auth = useAuthStore()

        try {
            const response = await api.post('/User/order', payload, {
                headers: {
                    'Idempotency-Key': idempotencyKey,
                },
            })
        
            this.order = response.data.orders ?? response.data.order
            return response.data
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.errors = Object.values(error.response.data.errors).flat()
                } else {
                    this.errors = [error.response?.data?.message || 'Checkout Failed']
                }
                throw error
            } finally {
                this.loading = false
            }
        },
        },
    })
