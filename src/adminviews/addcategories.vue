<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { useToast } from 'vue-toastification';
import AdminSidebar from '@/components/adminSidebar.vue'

const toast = useToast()
const router = useRouter();
const productStore = useProductStore();

const form = reactive({
    name: ''
});

const submitForm = async () => {
    const result = await productStore.addcategory(form);
    if (result) {
        toast.success(result.message || 'Category added to your catalog.')
        form.name = ''; // Clears the input field after success
        router.back(); // auto-redirect after adding
    } else {
        toast.error(productStore.errors[0] || 'We couldn’t add this category. Please try again.')
    }
};
</script>

<template>
    <AdminSidebar>
    <div class="mx-4 my-6 max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:mx-auto sm:my-8 lg:p-8">
        
        <div class="mb-8 border-b border-gray-100 pb-4">
            <h1 class="text-2xl font-bold text-gray-900">Add a category</h1>
            <p class="mt-1 text-sm text-gray-500">Create a category shoppers can use to discover related finds.</p>
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
                    class="cursor-pointer rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                    Add Category
                </button>
            </div>
        </form>
    </div>
    </AdminSidebar>
</template>