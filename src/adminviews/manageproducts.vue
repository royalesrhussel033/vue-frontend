<script setup>
import { RouterLink } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import adminSidebar from '@/components/adminSidebar.vue';
import { Trash2, SquarePen, CirclePlus } from '@lucide/vue'
import Swal from 'sweetalert2'
import { api } from '@/lib/api'

// Pagination setup constants
const perPage = ref(5)
const categoriesPerPage = ref(5)
const sizesPerPage = ref(5)

// Product Pagination
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(products.value.length / perPage.value))
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return products.value.slice(start, start + perPage.value)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Category Pagination
const currentCategoryPage = ref(1)

const totalCategoryPages = computed(() => {
  return Math.max(1, Math.ceil(categories.value.length / categoriesPerPage.value))
})

const paginatedCategories = computed(() => {
  const start = (currentCategoryPage.value - 1) * categoriesPerPage.value
  return categories.value.slice(start, start + categoriesPerPage.value)
})

const goToCategoryPage = (page) => {
  if (page >= 1 && page <= totalCategoryPages.value) {
    currentCategoryPage.value = page
  }
}

// Size Pagination
const currentSizePage = ref(1)

const totalSizePages = computed(() => {
  return Math.max(1, Math.ceil(sizes.value.length / sizesPerPage.value))
})

const paginatedSizes = computed(() => {
  const start = (currentSizePage.value - 1) * sizesPerPage.value
  return sizes.value.slice(start, start + sizesPerPage.value)
})

const goToSizePage = (page) => {
  if (page >= 1 && page <= totalSizePages.value) {
    currentSizePage.value = page
  }
}


// Delete Product
const confirmDeleteProduct = async(id) => {
  const result = await Swal.fire({
    title: 'Remove this product?',
    text: 'This piece will no longer appear in the shop.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Remove product',
    cancelButtonText: 'Keep product'
    })

    if (!result.isConfirmed) return

    try {
      await productStore.destroyProduct(id)
      await Swal.fire({
        title: 'Product removed',
        text: 'The piece is no longer listed in the shop.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      await Swal.fire({
        title: 'Couldn’t remove this product',
        text: error.response?.data?.message || 'Please refresh the inventory and try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }
}

// Delete Category
const confirmDeleteCategory = async(id) => {
  const result = await Swal.fire({
    title: 'Delete this category?',
    text: 'Products in this category won’t be deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete category',
    cancelButtonText: 'Keep category'
    })

    if (!result.isConfirmed) return

    try {
      await productStore.destroyCategory(id)
      await Swal.fire({
        title: 'Category deleted',
        text: 'The category has been removed.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      await Swal.fire({
        title: 'Couldn’t delete this category',
        text: error.response?.data?.message || 'Please refresh the inventory and try again.',
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }
}

// Delete Size
const confirmDeleteSize = async (id) => {
  const result = await Swal.fire({
    title: 'Delete this size?',
    text: 'The size option will be removed from your catalog.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete size',
    cancelButtonText: 'Keep size'
  })

  if (!result.isConfirmed) return

  try {
    await api.delete(`/Admin/destroyAdminSizes/${id}`)
    await fetchSizes()
    await Swal.fire({
      title: 'Size deleted',
      text: 'The size option has been removed.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    await Swal.fire({
      title: 'Couldn’t delete this size',
      text: error.response?.data?.message || 'Please refresh the inventory and try again.',
      icon: 'error',
      confirmButtonText: 'Okay'
    })
  }
}

const productStore = useProductStore()
const { products, categories } = storeToRefs(productStore)

const sizes = ref([])

const fetchSizes = async () => {
  try {
    const response = await api.get('/Admin/getAdminSizes')
    sizes.value = response.data
  } catch (error) {
    console.error('Failed to load sizes', error)
  }
}

onMounted(() => {
    productStore.fetchProducts()
    productStore.fetchCategories()
    fetchSizes()
})
</script>

<template>
  <adminSidebar>
    <div class="w-full p-6">
      
      <div class="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 class="text-3xl font-bold text-gray-900">Manage inventory</h1>
        <div class="flex gap-4">
          <RouterLink :to="{ name: 'sizes' }" class="px-5 py-2.5 bg-gray-300 hover:bg-gray-600 text-gray-600 hover:text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center">
            <CirclePlus :size="18" /> 
            <p class="px-2">Add size</p>
          </RouterLink>
          <RouterLink :to="{ name: 'addproduct' }" class="px-5 py-2.5 bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center">
            <CirclePlus :size="18" /> 
            <p class="px-2">Add product</p>
          </RouterLink>
          <RouterLink :to="{ name: 'addcategories' }" class="px-3 py-2.5 bg-emerald-100 hover:bg-emerald-600 text-emerald-600 hover:text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center">
            <CirclePlus :size="18" /> 
            <p class="px-2">Add category</p>
          </RouterLink>
        </div>
      </div>
      
      <div class="mb-12">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Products</h2>
        
        <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sizes</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="p in paginatedProducts" :key="p.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ p.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ p.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₱{{ p.price }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span :class="p.stock < 10 ? 'text-red-600 font-semibold' : ''">{{ p.stock }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{{ p.category }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <div v-if="p.sizes && p.sizes.length" class="flex gap-1 flex-wrap">
                    <span v-for="size in p.sizes" :key="size.id" class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {{ size.name }}
                    </span>
                  </div>
                  <span v-else class="text-xs text-gray-400 italic">No sizes</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <img v-if="p.image" :src="p.image" alt="Product" class="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm">
                  <span v-else class="text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded">No Image</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div class="flex justify-center gap-3">
                    <RouterLink :to="{ name: 'editproduct', params: { id: p.id } }" :aria-label="`Edit ${p.name}`" class="px-3 py-1.5 bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white font-medium rounded-md transition-colors duration-200">
                      <SquarePen :size="16" />
                    </RouterLink>
                    <button @click="confirmDeleteProduct(p.id)" :aria-label="`Remove ${p.name}`" class="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-700 hover:text-white hover:cursor-pointer font-medium rounded-md transition-colors duration-200">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="8" class="px-6 py-8 text-center text-sm text-gray-500">No products yet. Add a piece to start building your catalog.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="products.length > 0" class="mt-4 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-sm text-gray-600">
            Showing {{ (currentPage - 1) * perPage + 1 }} to
            {{ Math.min(currentPage * perPage, products.length) }} of
            {{ products.length }} products
          </p>
          <div class="flex gap-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="cursor-pointer px-3 py-1.5 rounded-lg border bg-white border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:hover:bg-white transition-colors">
              Previous
            </button>
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="page === currentPage ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'" class="cursor-pointer px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors">
              {{ page }}
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="cursor-pointer px-3 py-1.5 rounded-lg border bg-white border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:hover:bg-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
        
        <div class="max-w-3xl overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="c in paginatedCategories" :key="c.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ c.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <button @click="confirmDeleteCategory(c.id)" class="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:cursor-pointer font-medium rounded-md transition-colors duration-200">
                    <Trash2 :size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="categories.length === 0">
                <td colspan="2" class="px-6 py-8 text-center text-gray-500 italic">No categories found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="categories.length > 0" class="max-w-3xl mt-4 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-sm text-gray-600">
            Showing {{ (currentCategoryPage - 1) * categoriesPerPage + 1 }} to
            {{ Math.min(currentCategoryPage * categoriesPerPage, categories.length) }} of
            {{ categories.length }} categories
          </p>
          <div class="flex gap-2">
            <button @click="goToCategoryPage(currentCategoryPage - 1)" :disabled="currentCategoryPage === 1" class="cursor-pointer px-3 py-1.5 rounded-lg border bg-white border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:hover:bg-white transition-colors">
              Prev
            </button>
            <button v-for="page in totalCategoryPages" :key="page" @click="goToCategoryPage(page)" :class="page === currentCategoryPage ? 'bg-indigo-600 text-white border-indigo-600 ' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'" class="cursor-pointer px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors">
              {{ page }}
            </button>
            <button @click="goToCategoryPage(currentCategoryPage + 1)" :disabled="currentCategoryPage === totalCategoryPages" class="cursor-pointer px-3 py-1.5 rounded-lg border bg-white border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:hover:bg-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Sizes Management</h2>

        <div class="max-w-3xl overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size Name</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="size in paginatedSizes" :key="size.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ size.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <button @click="confirmDeleteSize(size.id)" class="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:cursor-pointer font-medium rounded-md transition-colors duration-200">
                    <Trash2 :size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="sizes.length === 0">
                <td colspan="2" class="px-6 py-8 text-center text-gray-500 italic">No sizes found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="sizes.length > 0" class="max-w-3xl mt-4 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p class="text-sm text-gray-600">
            Showing {{ (currentSizePage - 1) * sizesPerPage + 1 }} to
            {{ Math.min(currentSizePage * sizesPerPage, sizes.length) }} of
            {{ sizes.length }} sizes
          </p>
          <div class="flex gap-2">
            <button @click="goToSizePage(currentSizePage - 1)" :disabled="currentSizePage === 1" class="cursor-pointer px-3 py-1.5 rounded-lg border bg-white border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:hover:bg-white transition-colors">
              Prev
            </button>
            <button v-for="page in totalSizePages" :key="page" @click="goToSizePage(page)" :class="page === currentSizePage ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'" class="cursor-pointer px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors">
              {{ page }}
            </button>
            <button @click="goToSizePage(currentSizePage + 1)" :disabled="currentSizePage === totalSizePages" class="cursor-pointer px-3 py-1.5 rounded-lg border bg-white border-gray-300 hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:hover:bg-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  </adminSidebar>
</template>