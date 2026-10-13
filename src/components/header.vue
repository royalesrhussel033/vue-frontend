<script setup>
  import { useAuthStore } from '@/stores/auth'
  import { RouterLink } from 'vue-router'
  import { ShieldUser, ShoppingBasket, History, LogOut } from '@lucide/vue'
  import { defineAsyncComponent } from 'vue'
  import { ref } from 'vue'

    const LoginCard = defineAsyncComponent(() => import('@/components/loginCard.vue'))
    const RegisterCard = defineAsyncComponent(() => import('@/components/registerCard.vue'))
    const authStore = useAuthStore()

</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
      <!-- Logo -->
        <div class="shrink-0">
          <h1 class="text-2xl tracking-wider text-black"><RouterLink :to="{ name: 'home' }" class="hover:text-blue-600 transition">Thrifting Genix</RouterLink></h1>
        </div>

      <!-- Navigation -->
        <div class="gap-8 font-medium hidden md:flex items-center space-x-8">
          <RouterLink :to="{ name: 'shop' }" class="text-sm tracking-wide hover:text-gray-600 transition-colors">Shop</RouterLink>
          <!-- <RouterLink :to="{ name: 'newarrivals' }" class="text-sm tracking-wide hover:text-gray-600 transition-colors">New Arrivals</RouterLink>
          <RouterLink :to="{ name: 'collections' }" class="text-sm tracking-wide hover:text-gray-600 transition-colors">Collections</RouterLink>
          <RouterLink :to="{ name: 'sale' }" class="text-sm tracking-wide hover:text-gray-600 transition-colors">Sale</RouterLink> -->
          <!-- <RouterLink :to="{ name: 'about' }" class="text-sm tracking-wide hover:text-gray-600 transition-colors">About</RouterLink> -->
          <RouterLink v-if="authStore.user" :to="{ name: 'myOrders' }" class="text-sm tracking-wide hover:text-gray-600 transition-colors">My Order</RouterLink>
          
        </div>

      <!-- Auth + Icons -->
        <div class="flex items-center gap-6">

      <!-- Admin -->
        <RouterLink v-if="authStore.user?.role?.toLowerCase() === 'admin'" :to="{ name: 'Admindashboard'}" class="hover:text-blue-600 transition"> 
        
          <ShieldUser />
        
        </RouterLink>

      <!-- Auth -->
      <!-- Show Login/Register if no user -->
        <template v-if="!authStore.user">
          

        <button @click="authStore.openLoginModal = true; authStore.isRegister = false" class="px-4 py-2 bg-black cursor-pointer hover:bg-gray-800 text-white rounded">Login</button>
          <LoginCard
            v-show="authStore.openLoginModal && !authStore.isRegister" 
            v-model="authStore.openLoginModal" 
            @switch-to-register="authStore.isRegister = true" />

          <RegisterCard 
            v-show="authStore.openLoginModal && authStore.isRegister" 
            v-model="authStore.openLoginModal" 
            @switch-to-login="authStore.isRegister = false" />
        </template>
        
      <!-- Show Logout + Search + Cart if user exists -->
        <template v-else>
          
          <RouterLink :to="{ name: 'cart' }" class="hover:text-blue-600 transition">
            <ShoppingBasket />
          </RouterLink>
          <RouterLink :to="{ name: 'profile' }" class="text-sm hover:text-blue-600 transition">Profile</RouterLink>
          <RouterLink :to="{ name: 'orderHistory'}" class="hover:text-blue-600 transition">
            <History />
          </RouterLink>
          <button @click="authStore.logout" class="hover:text-blue-600 transition cursor-pointer">
            <LogOut />
          </button>
        </template>
  
      </div>
    </div>
  </div>
</nav>

  

</template>

<!-- <template>

    <header >
        <RouterLink :to="{ name: 'home' }"> Home </RouterLink>
        <RouterLink :to="{ name: 'about' }"> About </RouterLink>
        <RouterLink :to="{ name: 'shop' }"> Shop </RouterLink>

        <RouterLink v-if="authStore.user?.role?.toLowerCase() === 'admin'" :to="{ name: 'Admindashboard'}"> Admin </RouterLink>

        <RouterLink v-if="!authStore.user" :to="{ name: 'login' }"> Login </RouterLink>
        <RouterLink v-if="!authStore.user" :to="{ name: 'register' }"> Register </RouterLink>
        
        <button v-else @click="authStore.logout"> Logout </button>
    </header>

</template> -->

<style scoped>



</style>