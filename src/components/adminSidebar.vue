<script setup>
import { computed } from 'vue'
import { ref } from 'vue'
import { Menu, X, LayoutGrid, ShoppingCart, Package, Users, TrendingUp, Settings } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
import { Store, BookUser } from 'lucide-vue-next'

const authStore = useAuthStore()
const isOpen = ref(true)

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', to: { name: 'Admindashboard' }, requiresRole: 'admin' },
  { icon: ShoppingCart, label: 'Orders', to: { name: 'Orders' }, requiresRole: 'admin' },
  { icon: Package, label: 'Products', to: { name: 'manageproducts' }, requiresRole: 'admin' },
  { icon: Users, label: 'Sales', to: { name: 'Sales' }, requiresRole: 'admin' },
  { icon: BookUser, label: 'Contacts', to: { name: 'contacts' }, requiresRole: 'admin'},
  { icon: Store, label: 'Shop', to: { name: 'home' } }
  
]

const visibleNavItems = computed(() => 
  navItems.filter(
    (item) => item.to && (!item.requiresRole || authStore.user?.role === item.requiresRole)
  )
)
</script>

<template>
  <div class="flex min-h-screen w-full overflow-hidden bg-gray-50">
    <aside
      :class="[
        isOpen ? 'w-64' : 'w-20',
        'shrink-0 border-r border-gray-200 bg-white transition-all duration-300 flex flex-col'
      ]"
    >
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 v-if="isOpen" class="text-xl font-bold text-gray-900">Admin</h1>
        <button @click="isOpen = !isOpen" class="rounded p-2 hover:bg-gray-100">
          <X v-if="isOpen" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.label"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
        >
          <component :is="item.icon" :size="20" />
          <span v-if="isOpen">{{ item.label }}</span>
        </RouterLink>
        
      </nav>
    </aside>

    <main class="min-w-0 flex-1 overflow-y-auto">
      <slot />
    </main>
    
  </div>
</template>