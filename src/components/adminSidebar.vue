<script setup>
import { computed, ref } from 'vue'
import { BookUser, LayoutGrid, Menu, Package, ShoppingCart, Store, Users, X } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const isOpen = ref(true)

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', to: { name: 'Admindashboard' }, requiresRole: 'admin' },
  { icon: ShoppingCart, label: 'Orders', to: { name: 'Orders' }, requiresRole: 'admin' },
  { icon: Package, label: 'Products', to: { name: 'manageproducts' }, requiresRole: 'admin' },
  { icon: Users, label: 'Sales', to: { name: 'Sales' }, requiresRole: 'admin' },
  { icon: BookUser, label: 'Contacts', to: { name: 'contacts' }, requiresRole: 'admin' },
  { icon: Store, label: 'Shop', to: { name: 'home' } }
]

const visibleNavItems = computed(() =>
  navItems.filter(item => item.to && (!item.requiresRole || authStore.user?.role === item.requiresRole))
)
</script>

<template>
  <div class="flex h-screen min-h-0 w-full overflow-hidden bg-stone-50">
    <aside
      :class="[
        isOpen ? 'w-16 md:w-64' : 'w-16 md:w-20',
        'flex h-full shrink-0 flex-col overflow-y-auto border-r border-stone-200 bg-white transition-[width] duration-300'
      ]"
    >
      <div :class="['flex items-center border-b border-stone-200 p-3 md:p-4', isOpen ? 'justify-between' : 'justify-center md:justify-between']">
        <RouterLink v-if="isOpen" :to="{ name: 'Admindashboard' }" class="hidden min-w-0 text-lg font-semibold tracking-wide text-stone-900 md:block">
          Thrifting Genix
        </RouterLink>
        <span v-else class="hidden text-sm font-bold text-stone-900 md:block" aria-label="Thrifting Genix">TG</span>
        <span class="text-sm font-bold text-stone-900 md:hidden" aria-label="Thrifting Genix">TG</span>
        <button
          type="button"
          @click="isOpen = !isOpen"
          class="rounded-lg p-2 transition hover:bg-stone-100"
          :aria-label="isOpen ? 'Collapse admin navigation' : 'Expand admin navigation'"
          :title="isOpen ? 'Collapse navigation' : 'Expand navigation'"
          aria-controls="admin-navigation"
          :aria-expanded="isOpen"
        >
          <X v-if="isOpen" :size="19" />
          <Menu v-else :size="19" />
        </button>
      </div>

      <nav id="admin-navigation" class="flex-1 space-y-1 p-2 md:p-3" aria-label="Admin navigation">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.label"
          :to="item.to"
          :title="item.label"
          :aria-label="item.label"
          active-class="bg-stone-100 font-semibold text-black"
          :class="[
            'flex items-center gap-3 overflow-hidden rounded-xl py-3 text-stone-600 transition-colors hover:bg-stone-50 hover:text-black',
            isOpen ? 'justify-center px-3 md:justify-start md:px-4' : 'justify-center px-3'
          ]"
        >
          <component :is="item.icon" :size="19" aria-hidden="true" />
          <span v-if="isOpen" class="hidden min-w-0 truncate text-sm md:inline">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
      <slot />
    </main>
  </div>
</template>
