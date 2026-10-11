import { defineStore } from 'pinia'
import { api } from '@/lib/api'
import { useToast } from 'vue-toastification'



const toast = useToast()

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: []
    }),
    actions: {
        async addToCart(product, qty = 1, size_id = null, size_name = null) {
            try {
                await api.post('/User/addtocart', {
                    product_id: product.id,
                    quantity: qty,
                    size_id,
                });
                
                const existing = this.items.find(item =>
                    item.product_id === product.id && item.size_id === size_id)
                if (existing) {
                    existing.quantity += qty
                } else {
                    this.items.push({ ...product, quantity: qty, size_id, size_name })
                }

                toast.success(`${product.name} Added to Cart!`)
                return true
            } catch (error) {
                this.errors = error.response?.data?.error || []
                console.error('Failed to add to cart:', error)
                throw error
            }
        },
        
        async fetchCartItem() {
            try {
                const response = await api.get('/User/getCartItems')
                this.items = response.data
            } catch (error) {
                console.error('Error fetching Cart Items:', error)
            }
        },

        async removeCartItem(id) {
                try {
                    await api.delete('/User/removeCartItems/' + id);
                    this.items = this.items.filter(item => item.id !== id)
                } catch (error) {
                    console.error('Failed to remove cart item: ', error)
                }
                
            
        }

    }
})