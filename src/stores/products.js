import { defineStore } from 'pinia'
import { api } from '@/lib/api'
import router from '@/router'
import FeaturedProduct from '@/components/featuredProduct.vue'





export const useProductStore = defineStore('products', {
    state: () => ({
        user: null,
        errors: null,
        loading: false,
        categories: [],
        newCategory: "",
        products: [],
        featuredProducts: [],
        bestSellerProducts: [],
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
                this.errors = error.response?.data?.error || []
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
                    if (error.response?.data?.errors) {
                        this.errors = error.response.data.errors
                    } else {
                        this.errors = []
                    }
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
                if (error.response?.data?.errors) {
                    this.errors = error.response.data.errors
                } else {
                    this.errors = []
                }
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
            try {
                const response = await api.get('/Guest/getProducts')
                this.featuredProducts = response.data
            } catch (error) {
                console.error('Error fetching featured Products', error)
            }  
        },

        async fetchShopProducts() {
            try {
                const response = await api.get('/Guest/getShopProducts')
                this.products = response.data
            } catch (error) {
                console.error('Error fetching Shop Products.')
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
            try {
                const response = await api.get('/Guest/getBestSeller')
                this.bestSellerProducts = response.data
            } catch (error) {
                console.error("Error fetching Best sellers:", error)
            }
        },
    }
})