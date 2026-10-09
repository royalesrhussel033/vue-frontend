import { defineStore } from 'pinia'
import { api } from '@/lib/api'

export const orderStore = defineStore('orders', {
    state: () => ({
        items: [],
        sales: [],
        selectedOrder: null,
    }),
    actions: {
        async getOrders() {
            try {
                const response = await api.get('/User/getOrders')
                this.items = response.data
            } catch (error) {
                console.error('Error fetching Orders:', error)
            }
        },

        async getOrderHistory() {
            try {
                const response = await api.get('User/getOrderHistory')
                this.items = response.data 
            } catch (error) {
                console.error('Error fetching Order History:', error)
            }
        },

        async getOrder(id) {
            if (!id) return
            try {
                const response = await api.get(`/User/getOrders/${id}`)
                this.selectedOrder = response.data
            } catch (error) {
                console.error('Error fetching Order Id:', error)
            }
        },

        async getAdminOrders() {
            try {
                const response = await api.get('/Admin/getOrders')
                this.items = response.data
            } catch (error) {
                console.error('Error fetching Orders:', error)
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