<script setup>

  import { RouterLink } from 'vue-router'

</script>

<template>
  <section class="relative h-[calc(100vh-4rem)] overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img
        src="/public/Images/heroSectionImage.jpg"
        alt="A model wearing a thoughtfully styled vintage outfit"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent"></div>
    </div>

    <!-- Hero Content -->
    <div class="relative h-full flex items-center justify-center text-center px-4">
      <div class="max-w-3xl">
        <p class="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">Thrifting Genix</p>
        <h2 class="mb-6 text-5xl font-semibold leading-tight tracking-wide text-white md:text-7xl">
          One-of-a-kind finds. Ready for a new story.
        </h2>
        <p class="mb-8 text-lg tracking-wide text-white/90 md:text-xl">
          Discover pre-loved pieces with plenty of life—and style—left in them.
        </p>
        <RouterLink :to="{ name: 'shop'}">
          <button
            class="rounded-lg bg-white px-8 py-3 font-medium tracking-wide text-black transition-all hover:scale-105 hover:bg-gray-100 hover:cursor-pointer ">Explore the shop
          </button>
        </RouterLink>
        
      </div>
    </div>
  </section>
</template>