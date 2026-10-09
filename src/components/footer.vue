<script setup>
import { Instagram, Facebook, Twitter } from "lucide-vue-next"
import { RouterLink } from "vue-router";

</script>

<template>
  <footer class="bg-black text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <!-- Brand -->
        <div>
          <h3 class="text-xl mb-4 tracking-wider">Thrifting Genix</h3>
          <p class="text-gray-400 text-sm tracking-wide">
            Timeless fashion for the modern individual.
          </p>
        </div>

        <!-- Shop -->
        <div>
          <h4 class="mb-4 tracking-wide">Shop</h4>
          <RouterLink :to="{ name: 'shop' }">
            <ul class="space-y-2 text-sm text-gray-400">
              <li><p class="hover:text-white transition-colors">New Arrivals</p></li>
              <li><p class="hover:text-white transition-colors">Clothing</p></li>
              <li><p class="hover:text-white transition-colors">Accessories</p></li>
              <li><p class="hover:text-white transition-colors">Sale</p></li>
            </ul>
          </RouterLink>
        </div>

        <!-- Help -->
        <div>
          <h4 class="mb-4 tracking-wide">Help</h4>
          <RouterLink :to="{ name: 'contactUs' }">
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a class="hover:text-white transition-colors">Customer Service</a></li>
              <li><a class="hover:text-white transition-colors">Shipping & Returns</a></li>
              <!-- <li><a href="#" class="hover:text-white transition-colors">Size Guide</a></li> -->
              <li><a class="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </RouterLink>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="mb-4 tracking-wide">Newsletter</h4>
          <p class="text-sm text-gray-400 mb-4">Subscribe for exclusive updates</p>
          <div class="flex">
            <input
              type="email"
              placeholder="Email address"
              class="bg-white/10 border border-white/20 px-4 py-2 flex-1 text-sm focus:outline-none focus:border-white"
            />
            <button
              class="bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors text-sm"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-400 mb-4 md:mb-0">
          © 2026 Thrifting Genix. All rights reserved.
        </p>
        <div class="flex space-x-6">
          <a href="#" class="text-gray-400 hover:text-white transition-colors">
            <Instagram :size="20" />
          </a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">
            <Facebook :size="20" />
          </a>
          <a href="#" class="text-gray-400 hover:text-white transition-colors">
            <Twitter :size="20" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>