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
  <div class="flex min-h-screen w-full overflow-hidden bg-stone-50">
    <aside
      :class="[
        isOpen ? 'w-16 md:w-64' : 'w-16 md:w-20',
        'flex shrink-0 flex-col border-r border-stone-200 bg-white transition-all duration-300'
      ]"
    >
      <div class="flex items-center justify-between border-b border-stone-200 p-3 md:p-4">
        <RouterLink :to="{ name: 'Admindashboard' }" class="hidden text-lg font-semibold tracking-wide text-stone-900 md:block">
          Thrifting Genix
        </RouterLink>
        <span class="text-sm font-bold text-stone-900 md:hidden" aria-label="Thrifting Genix">TG</span>
        <button
          type="button"
          @click="isOpen = !isOpen"
          class="rounded-lg p-2 transition hover:bg-stone-100"
          :aria-label="isOpen ? 'Collapse admin navigation' : 'Expand admin navigation'"
          :title="isOpen ? 'Collapse navigation' : 'Expand navigation'"
        >
          <X v-if="isOpen" :size="19" />
          <Menu v-else :size="19" />
        </button>
      </div>

      <nav class="flex-1 space-y-1 p-2 md:p-3" aria-label="Admin navigation">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.label"
          :to="item.to"
          :title="item.label"
          :aria-label="item.label"
          active-class="bg-stone-100 font-semibold text-black"
          class="flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-stone-600 transition-colors hover:bg-stone-50 hover:text-black md:justify-start md:px-4"
        >
          <component :is="item.icon" :size="19" aria-hidden="true" />
          <span v-if="isOpen" class="hidden text-sm md:inline">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="min-w-0 flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
