<script setup>
  import { computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import Header from './components/header.vue';
  import Footer from './components/footer.vue';
  import { useAuthStore } from './stores/auth.js';

  const route = useRoute()
  const showPublicChrome = computed(() => !route.meta.isAdmin)

  const auth = useAuthStore()
  const appReady = computed(() => auth.initialized && !auth.loading)

  onMounted(async () => {
    if (!auth.initialized) {
      await auth.init()
    }
  })
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col">
    <template v-if="!appReady">
      <div class="h-16 bg-white border-b border-gray-100 flex items-center px-6">
        <div class="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <main class="flex-1">
        <div class="min-h-[70vh] flex items-center justify-center">
          <div class="text-sm text-gray-500" role="status" aria-live="polite">Getting the shop ready…</div>
        </div>
      </main>

      <div class="bg-black text-white py-16">
        <div class="h-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse bg-white/10 rounded"></div>
      </div>
    </template>

    <template v-else>
      <Header v-if="showPublicChrome" />

      <main :class="showPublicChrome ? 'pt-16 flex-1' : 'flex-1'">
        <router-view />
      </main>

      <Footer v-if="showPublicChrome" />
    </template>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
