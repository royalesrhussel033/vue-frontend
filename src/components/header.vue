<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { History, LogOut, Menu, ShieldUser, ShoppingBasket, X } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'

const LoginCard = defineAsyncComponent(() => import('@/components/loginCard.vue'))
const RegisterCard = defineAsyncComponent(() => import('@/components/registerCard.vue'))
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
</script>

<template>
  <nav class="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <RouterLink :to="{ name: 'home' }" class="shrink-0 text-xl font-semibold tracking-wide text-black transition hover:text-gray-600">
          Thrifting Genix
        </RouterLink>

        <div class="hidden items-center gap-8 font-medium md:flex">
          <RouterLink :to="{ name: 'shop' }" class="text-sm tracking-wide transition-colors hover:text-gray-500">Shop</RouterLink>
          <RouterLink v-if="authStore.user" :to="{ name: 'myOrders' }" class="text-sm tracking-wide transition-colors hover:text-gray-500">My orders</RouterLink>
        </div>

        <div class="flex items-center gap-4">
          <RouterLink
            v-if="authStore.user?.role?.toLowerCase() === 'admin'"
            :to="{ name: 'Admindashboard' }"
            aria-label="Admin dashboard"
            title="Admin dashboard"
            class="hidden transition hover:text-gray-500 sm:inline-flex"
          >
            <ShieldUser :size="20" />
          </RouterLink>

          <template v-if="!authStore.user">
            <button
              class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              @click="authStore.openLoginModal = true; authStore.isRegister = false"
            >
              Sign in
            </button>
            <LoginCard
              v-show="authStore.openLoginModal && !authStore.isRegister"
              v-model="authStore.openLoginModal"
              @switch-to-register="authStore.isRegister = true"
            />
            <RegisterCard
              v-show="authStore.openLoginModal && authStore.isRegister"
              v-model="authStore.openLoginModal"
              @switch-to-login="authStore.isRegister = false"
            />
          </template>

          <template v-else>
            <RouterLink :to="{ name: 'cart' }" aria-label="Shopping bag" title="Shopping bag" class="transition hover:text-gray-500">
              <ShoppingBasket :size="20" />
            </RouterLink>
            <RouterLink :to="{ name: 'profile' }" class="hidden text-sm transition hover:text-gray-500 sm:inline">Profile</RouterLink>
            <RouterLink :to="{ name: 'orderHistory' }" aria-label="Order history" title="Order history" class="hidden transition hover:text-gray-500 sm:inline-flex">
              <History :size="20" />
            </RouterLink>
            <button @click="authStore.logout" aria-label="Sign out" title="Sign out" class="hidden cursor-pointer transition hover:text-gray-500 sm:inline-flex">
              <LogOut :size="20" />
            </button>
          </template>

          <button
            type="button"
            class="inline-flex rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-navigation"
            :aria-label="mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <X v-if="mobileMenuOpen" :size="20" />
            <Menu v-else :size="20" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="mobileMenuOpen" id="mobile-navigation" class="border-t border-gray-100 bg-white px-4 py-3 shadow-lg md:hidden">
      <nav class="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Mobile navigation">
        <RouterLink :to="{ name: 'shop' }" class="rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50" @click="mobileMenuOpen = false">Shop</RouterLink>
        <template v-if="authStore.user">
          <RouterLink :to="{ name: 'myOrders' }" class="rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50" @click="mobileMenuOpen = false">My orders</RouterLink>
          <RouterLink :to="{ name: 'cart' }" class="rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50" @click="mobileMenuOpen = false">Shopping bag</RouterLink>
          <RouterLink :to="{ name: 'profile' }" class="rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50" @click="mobileMenuOpen = false">Profile</RouterLink>
          <RouterLink v-if="authStore.user?.role?.toLowerCase() === 'admin'" :to="{ name: 'Admindashboard' }" class="rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-50" @click="mobileMenuOpen = false">Admin dashboard</RouterLink>
          <button class="rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-gray-50" @click="mobileMenuOpen = false; authStore.logout()">Sign out</button>
        </template>
        <button
          v-else
          class="rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-gray-50"
          @click="mobileMenuOpen = false; authStore.openLoginModal = true; authStore.isRegister = false"
        >
          Sign in to your account
        </button>
      </nav>
    </div>
  </nav>
</template>
