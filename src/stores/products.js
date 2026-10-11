import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import FeaturedProduct from '@/components/featuredProduct.vue'


axios.defaults.baseURL = 'http://127.0.0.1:8000/api'


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
                const response = await axios.post('/Admin/updateproduct/' + id, formData)
                
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
                const response = await axios.post('/Admin/addcategories', formData) 
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
                const response = await axios.post('/Admin/addproduct', formData, {
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
                const response = await axios.get('/Admin/showcategories')
                this.categories = response.data;
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        },

        // fetch products to admin
        async fetchProducts() {
            try {
                const response = await axios.get('/Admin/showproducts')
                this.products = response.data;
            } catch (error) {
                console.error("Error fetching products:", error)
            }
        },

        async destroyProduct(id) {
            await axios.delete('/Admin/deleteproduct/' + id);

            // Update list
            
            this.products = this.products.filter(p => p.id !== id)
        },

        async destroyCategory(id) {
            await axios.delete('/Admin/deletecategory/' + id);

            // Update list

            this.categories = this.categories.filter(c => c.id !== id)
        },

        async fetchUserProducts() {
            try {
                const response = await axios.get('/Guest/getProducts')
                this.featuredProducts = response.data
            } catch (error) {
                console.error('Error fetching featured Products', error)
            }  
        },

        async fetchShopProducts() {
            try {
                const response = await axios.get('/Guest/getShopProducts')
                this.products = response.data
            } catch (error) {
                console.error('Error fetching Shop Products.')
            }
        },

        async fetchUserCategories() {
            try {
                const response = await axios.get('/Guest/getCategories')
                this.categories = response.data;
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        },

        async fetchBestSeller() {
            try {
                const response = await axios.get('/Guest/getBestSeller')
                this.bestSellerProducts = response.data
            } catch (error) {
                console.error("Error fetching Best sellers:", error)
            }
        },
    }
})