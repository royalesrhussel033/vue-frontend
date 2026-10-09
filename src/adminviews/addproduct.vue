<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { api } from '@/lib/api'

const toast = useToast()
const router = useRouter()
const productStore = useProductStore()
const { categories } = storeToRefs(productStore)

const form = reactive({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null
})

const sizesList = ref([])
const selectedSizes = ref([])

onMounted(async () => {
    productStore.fetchCategories()

    const response = await api.get('/Admin/getAdminSizes')
    sizesList.value = response.data
})

const submitForm = async () => {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('price', form.price)
    formData.append('stock', form.stock)
    formData.append('category', form.category)
    if (form.image) {
        formData.append('image', form.image)
    }

    selectedSizes.value.forEach(id => {
        formData.append('size_ids[]', id)
    })

    const result = await productStore.addproduct(formData)
    if (result) {
        toast.success('Product Added')
        router.back() // Redirects back to the product list
    }

    console.log('selectedSizes', selectedSizes.value)
}

const handleFileChange = (event) => {
    form.image = event.target.files[0]
}
</script>

<template>
    <div class="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8">
        
        <div class="mb-8 border-b border-gray-100 pb-4">
            <h1 class="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p class="text-sm text-gray-500 mt-1">Fill out the details below to add a new item to your catalog.</p>
        </div>

        <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                <div class="md:col-span-2">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Product Name</label>
                    <input v-model="form.name" type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g. Laptop" required />
                </div>

                <div class="md:col-span-2">
                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900">Description</label>
                    <textarea v-model="form.description" id="description" rows="4" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g. Laptop is a gadget! wow" required></textarea>
                </div>

                <div>
                    <label for="price" class="block mb-2 text-sm font-medium text-gray-900">Price</label>
                    <input v-model="form.price" type="number" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="29999" required />
                </div>

                <div>
                    <label for="stock" class="block mb-2 text-sm font-medium text-gray-900">Stock Available</label>
                    <input v-model="form.stock" type="number" id="stock" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="10" required />
                </div>

                <div>
                    <label for="category" class="block mb-2 text-sm font-medium text-gray-900">Category</label>
                    <select v-model="form.category" id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer" required>
                        <option disabled value="">Select a category</option>
                        <option v-for="c in categories" :key="c.id" :value="c.name">
                            {{ c.name }}
                        </option>
                    </select>
                </div>

                <div class="md:col-span-2">
                    <label class="block mb-2 text-sm font-medium text-gray-900">Available Sizes</label>
                    <div class="flex gap-2 flex-wrap">
                        <label v-for="size in sizesList" :key="size.id" class="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                        <input type="checkbox" :value="size.id" v-model="selectedSizes" class="h-4 w-4" />
                        <span>{{ size.name }}</span>
                        </label>
                    </div>
                    </div>

                <div>
                    <label for="image" class="block mb-2 text-sm font-medium text-gray-900">Product Image</label>
                    <input @change="handleFileChange" type="file" id="image" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                </div>

            </div>

            <div class="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
                <button type="button" @click="router.back()" class="cursor-pointer text-gray-700 bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" class="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                    Add Product
                </button>
            </div>
        </form>
    </div>
</template>