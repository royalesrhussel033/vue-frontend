<script setup>
defineProps({
  id: Number,
  name: String,
  price: [Number, String],
  category: String,
  image: String
})
</script>

<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
    <img :src="image" :alt="name" class="rounded mb-4 w-full h-64 object-cover" />
    <h3 class="text-lg font-semibold">{{ name }}</h3>
    <p class="text-gray-600 mb-2">{{ category }}</p>
    
  </div>
</template>