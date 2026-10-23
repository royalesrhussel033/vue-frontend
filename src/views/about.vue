<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="min-h-[70vh] bg-stone-50 px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-12 lg:grid-cols-2">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Our point of view</p>
        <h1 class="mt-3 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">Great style deserves a second life.</h1>
      </div>
      <div class="space-y-4 text-base leading-7 text-stone-600">
        <p>Thrifting Genix is all about finding character in pre-loved clothing. Each piece is chosen for its own look, feel, and possibility.</p>
        <p>We believe getting dressed should be personal, considered, and kind to your budget. Browse the collection and see what speaks to you.</p>
        <RouterLink :to="{ name: 'shop' }" class="inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700">
          Explore the collection
        </RouterLink>
      </div>
    </div>
  </section>
</template>