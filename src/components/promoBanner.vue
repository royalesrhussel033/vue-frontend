<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <section class="bg-stone-100 py-16 md:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Style with a second life</p>
        <h2 class="mb-5 text-3xl font-semibold tracking-wide md:text-5xl">Good clothes deserve another story.</h2>
        <p class="mb-8 text-lg tracking-wide text-gray-600 md:text-xl">
          Shop thoughtfully chosen pre-loved pieces and make a little room for something different.
        </p>
        <RouterLink :to="{ name: 'shop' }" class="inline-flex rounded-lg bg-black px-8 py-3 font-medium tracking-wide text-white transition hover:scale-105 hover:bg-gray-800">
          Find your next favorite
        </RouterLink>
      </div>
    </div>
  </section>
</template>