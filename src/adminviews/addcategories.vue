<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { useToast } from 'vue-toastification';

const toast = useToast()
const router = useRouter();
const productStore = useProductStore();

const form = reactive({
    name: ''
});

const submitForm = async () => {
    const result = await productStore.addcategory(form);
    if (result) {
        toast.success('Category Added')
        form.name = ''; // Clears the input field after success
        router.back(); // auto-redirect after adding
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8">
        
        <div class="mb-8 border-b border-gray-100 pb-4">
            <h1 class="text-2xl font-bold text-gray-900">Add New Category</h1>
            <p class="text-sm text-gray-500 mt-1">Create a new product category to keep your store organized.</p>
        </div>

        <form @submit.prevent="submitForm">
            <div class="mb-8">
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Category Name</label>
                <input 
                    v-model="form.name" 
                    type="text" 
                    id="name" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    placeholder="e.g. Outerwear" 
                    required 
                />
            </div>

            <div class="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
                <button 
                    type="button" 
                    @click="router.back()" 
                    class="cursor-pointer text-gray-700 bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    class="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Add Category
                </button>
            </div>
        </form>
    </div>
</template>