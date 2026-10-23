import { defineStore } from 'pinia'
import { api } from '@/lib/api'
import router from '@/router'
import FeaturedProduct from '@/components/featuredProduct.vue'


const getErrorMessages = (error, fallback) => {
    const validationMessages = Object.values(error.response?.data?.errors ?? {}).flat()
    return validationMessages.length
        ? validationMessages
        : [error.response?.data?.message || error.response?.data?.error || fallback]
}


export const useProductStore = defineStore('products', {
    state: () => ({
        user: null,
        errors: [],
        loading: false,
        categories: [],
        newCategory: "",
        products: [],
        shopError: null,
        featuredProducts: [],
        featuredProductsError: null,
        featuredProductsLoading: false,
        bestSellerProducts: [],
        bestSellerProductsError: null,
        bestSellerProductsLoading: false,
    }),
    actions: {
        async updateproduct(id, formData) {
            this.errors = []
            this.loading = true
            try {
                const response = await api.post('/Admin/updateproduct/' + id, formData)
                
                await this.fetchProducts()
                
                const index = this.products.findIndex(p => p.id === response.data.product.id)
                if (index !== -1) {
                    this.products[index] = response.data.product
                }
                return response.data
            } catch (error) {
                this.errors = getErrorMessages(error, 'We couldn’t update this piece. Please try again.')
                return null
            } finally {
                this.loading = false
            }
        },

        async addcategory(formData) {
            this.errors = []
            this.loading = true
            try {
                const response = await api.post('/Admin/addcategories', formData) 
                this.newCategory = "";
                await this.fetchCategories();
                return response.data
                } catch (error) {
                    this.errors = getErrorMessages(error, 'We couldn’t add this category. Please try again.')
                    return null
                } finally {
                    this.loading = false
                }
            },

        async addproduct(formData) {
            this.errors = []
            this.loading = true
            try {
                const response = await api.post('/Admin/addproduct', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                await this.fetchProducts();
                return response.data
            } catch (error) {
                this.errors = getErrorMessages(error, 'We couldn’t add this piece. Please try again.')
                return null
            } finally {
                this.loading = false
            }
        },

        async fetchCategories() {
            try {
                const response = await api.get('/Admin/showcategories')
                this.categories = response.data;
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        },

        // fetch products to admin
        async fetchProducts() {
            try {
                const response = await api.get('/Admin/showproducts')
                this.products = response.data;
            } catch (error) {
                console.error("Error fetching products:", error)
            }
        },

        async destroyProduct(id) {
            await api.delete('/Admin/deleteproduct/' + id);

            // Update list
            
            this.products = this.products.filter(p => p.id !== id)
        },

        async destroyCategory(id) {
            await api.delete('/Admin/deletecategory/' + id);

            // Update list

            this.categories = this.categories.filter(c => c.id !== id)
        },

        async fetchUserProducts() {
            this.featuredProductsError = null
            this.featuredProductsLoading = true
            try {
                const response = await api.get('/Guest/getProducts')
                this.featuredProducts = response.data
            } catch (error) {
                this.featuredProductsError = error.response?.data?.message || 'We couldn’t load new arrivals. Please try again.'
                console.error('Error fetching featured Products', error)
            } finally {
                this.featuredProductsLoading = false
            }
        },

        async fetchShopProducts() {
            this.shopError = null
            try {
                const response = await api.get('/Guest/getShopProducts')
                this.products = response.data
            } catch (error) {
                this.shopError = error.response?.data?.message || 'We couldn’t load the shop. Please try again.'
                console.error('Error fetching Shop Products:', error)
            }
        },

        async fetchUserCategories() {
            try {
                const response = await api.get('/Guest/getCategories')
                this.categories = response.data;
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        },

        async fetchBestSeller() {
            this.bestSellerProductsError = null
            this.bestSellerProductsLoading = true
            try {
                const response = await api.get('/Guest/getBestSeller')
                this.bestSellerProducts = response.data
            } catch (error) {
                this.bestSellerProductsError = error.response?.data?.message || 'We couldn’t load bestsellers. Please try again.'
                console.error("Error fetching Best sellers:", error)
            } finally {
                this.bestSellerProductsLoading = false
            }
        },
    }
})