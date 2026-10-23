<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="bg-black py-12 text-white sm:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-10 border-b border-white/15 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <RouterLink :to="{ name: 'home' }" class="text-xl font-semibold tracking-wide">Thrifting Genix</RouterLink>
          <p class="mt-3 max-w-sm text-sm leading-6 text-gray-400">
            One-of-a-kind pieces, ready for a new story. Find your next favorite and give great clothes another go.
          </p>
        </div>

        <div>
          <h2 class="text-sm font-semibold uppercase tracking-wider">Explore</h2>
          <div class="mt-4 flex flex-col items-start gap-3 text-sm text-gray-400">
            <RouterLink :to="{ name: 'shop' }" class="transition-colors hover:text-white">Shop all finds</RouterLink>
            <RouterLink :to="{ name: 'contactUs' }" class="transition-colors hover:text-white">Contact us</RouterLink>
          </div>
        </div>

        <div>
          <h2 class="text-sm font-semibold uppercase tracking-wider">A more considered wardrobe</h2>
          <p class="mt-4 text-sm leading-6 text-gray-400">
            Shopping pre-loved is a lovely way to discover something different and keep wearable clothing in circulation.
          </p>
        </div>
      </div>

      <p class="pt-6 text-sm text-gray-500">
        © 2026 Thrifting Genix. Every piece has a past—and room for a new one.
      </p>
    </div>
  </footer>
</template>
