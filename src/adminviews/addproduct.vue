<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { api } from '@/lib/api'
import AdminSidebar from '@/components/adminSidebar.vue'

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
        toast.success(result.message || 'New piece added to your catalog.')
        router.back() // Redirects back to the product list
    } else {
        toast.error(productStore.errors[0] || 'We couldn’t add this piece. Please try again.')
    }
}

const handleFileChange = (event) => {
    form.image = event.target.files[0]
}
</script>

<template>
    <AdminSidebar>
    <div class="mx-4 my-6 max-w-4xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:mx-auto sm:my-8 lg:p-8">
        
        <div class="mb-8 border-b border-gray-100 pb-4">
            <h1 class="text-2xl font-bold text-gray-900">Add a product</h1>
            <p class="mt-1 text-sm text-gray-500">Add the details shoppers need to picture this pre-loved piece.</p>
        </div>

        <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                <div class="md:col-span-2">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Product Name</label>
                    <input v-model="form.name" type="text" id="name" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-black focus:ring-black" placeholder="e.g. Vintage denim jacket" required />
                </div>

                <div class="md:col-span-2">
                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900">Description</label>
                    <textarea v-model="form.description" id="description" rows="4" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-black focus:ring-black" placeholder="Describe the fit, fabric, and any signs of wear." required></textarea>
                </div>

                <div>
                    <label for="price" class="block mb-2 text-sm font-medium text-gray-900">Price</label>
                    <input v-model="form.price" type="number" id="price" min="0" step="0.01" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-black focus:ring-black" placeholder="e.g. 299" required />
                </div>

                <div>
                    <label for="stock" class="block mb-2 text-sm font-medium text-gray-900">Quantity available</label>
                    <input v-model="form.stock" type="number" id="stock" min="0" step="1" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-black focus:ring-black" placeholder="e.g. 1" required />
                </div>

                <div>
                    <label for="category" class="block mb-2 text-sm font-medium text-gray-900">Category</label>
                    <select v-model="form.category" id="category" class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-black focus:ring-black" required>
                        <option disabled value="">Select a category</option>
                        <option v-for="c in categories" :key="c.id" :value="c.name">
                            {{ c.name }}
                        </option>
                    </select>
                </div>

                <div class="md:col-span-2">
                    <label class="block mb-2 text-sm font-medium text-gray-900">Sizes available</label>
                    <div class="flex gap-2 flex-wrap">
                        <label v-for="size in sizesList" :key="size.id" class="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer">
                        <input type="checkbox" :value="size.id" v-model="selectedSizes" class="h-4 w-4" />
                        <span>{{ size.name }}</span>
                        </label>
                    </div>
                    </div>

                <div>
                    <label for="image" class="block mb-2 text-sm font-medium text-gray-900">Piece photos</label>
                    <input @change="handleFileChange" type="file" id="image" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                </div>

            </div>

            <div class="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
                <button type="button" @click="router.back()" class="cursor-pointer text-gray-700 bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" class="cursor-pointer rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800">
                    Add Product
                </button>
            </div>
        </form>
    </div>
    </AdminSidebar>
</template>