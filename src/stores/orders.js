import { defineStore } from 'pinia'
import { api } from '@/lib/api'



export const orderStore = defineStore('orders', {
    state: () => ({
        items: [],
        sales: [],
        selectedOrder: null,
        isLoading: false,
        error: null,
        selectedOrderError: null,
    }),
    actions: {
        async getOrders() {
            this.isLoading = true
            this.error = null
            try {
                const response = await api.get('/User/getOrders')
                this.items = response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'We couldn’t load your orders. Please try again.'
                console.error('Error fetching Orders:', error)
            } finally {
                this.isLoading = false
            }
        },

        async getOrderHistory() {
            this.isLoading = true
            this.error = null
            try {
                const response = await api.get('User/getOrderHistory')
                this.items = response.data 
            } catch (error) {
                this.error = error.response?.data?.message || 'We couldn’t load your order history. Please try again.'
                console.error('Error fetching Order History:', error)
            } finally {
                this.isLoading = false
            }
        },

        async getOrder(id) {
            if (!id) return
            this.selectedOrder = null
            this.selectedOrderError = null
            try {
                const response = await api.get(`/User/getOrders/${id}`)
                this.selectedOrder = response.data
            } catch (error) {
                this.selectedOrderError = error.response?.data?.message || 'We couldn’t load these order details. Please try again.'
                console.error('Error fetching Order Id:', error)
            }
        },

        async getAdminOrders() {
            this.isLoading = true
            this.error = null
            try {
                const response = await api.get('/Admin/getOrders')
                this.items = response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'We couldn’t load orders. Please refresh and try again.'
                console.error('Error fetching Orders:', error)
            } finally {
                this.isLoading = false
            }
        },
        
        async updateOrderStatus(id, status) {
            try {
                const response = await api.put(`/Admin/updateOrderStatus/${id}`, { status })
                return response.data
            } catch (error) {
                console.error('Error updating order status:', error)
                throw error
            }
        },

        async fetchAdminSales() {
            try {
                const response = await api.get('/Admin/getSales')
                this.sales = response.data
            } catch (error) {
                console.error("Error fetching sales:", error)
            }
        }
    }
})