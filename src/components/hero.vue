<script setup>

  import { RouterLink } from 'vue-router'

</script>

<template>
  <section class="relative h-[calc(100vh-4rem)] overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img
        src="/public/Images/heroSectionImage.jpg"
        alt="Hero fashion model"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/10"></div>
    </div>

    <!-- Hero Content -->
    <div class="relative h-full flex items-center justify-center text-center px-4">
      <div class="max-w-3xl">
        <h2 class="text-5xl md:text-7xl mb-6 text-white tracking-wider">
          Thrifting Genix Collection 2026
        </h2>
        <p class="text-lg md:text-xl text-white/90 mb-8 tracking-wide">
          Timeless elegance meets modern minimalism
        </p>
        <RouterLink :to="{ name: 'shop'}">
          <button
            class="bg-white text-black px-8 py-3 hover:bg-gray-100 transition-all transform hover:scale-105 tracking-wide hover:cursor-pointer ">Explore Now
          </button>
        </RouterLink>
        
      </div>
    </div>
  </section>
</template>