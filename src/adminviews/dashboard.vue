<script setup>
import { ref, onMounted } from 'vue';
import adminSidebar from '@/components/adminSidebar.vue';
import DashboardMetrics from '@/components/dashboardMetrics.vue';
import RecentOrders from '@/components/recentOrders.vue';
import RevenueChart from '@/components/revenueChart.vue';
import LowStockAlerts from '@/components/lowStockAlerts.vue';
import TopProducts from '@/components/topProducts.vue';
import { api } from '@/lib/api'

const dashboardData = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  activeUsers: 0,
  pendingOrders: 0,
  recentOrders: [],
  topProducts: [],
  lowStockItems: []
});

const isLoading = ref(true);
const dashboardError = ref('');

onMounted(async () => {
  await fetchDashboardData();
});

async function fetchDashboardData() {
  isLoading.value = true;
  dashboardError.value = '';
  try {
    const response = await api.get('/Admin/dashboard-stats')
    dashboardData.value = response.data;
  } catch (error) {
    dashboardError.value = error.response?.data?.message || 'We couldn’t load the dashboard. Please try again.'
    console.error('Error fetching dashboard data:', error.response?.data || error.message)
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
    <adminSidebar>

        <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Store overview</p>
        <h1 class="mt-2 text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 text-gray-500">A clear view of orders, inventory, and sales.</p>
      </div>

      <div v-if="dashboardError" class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
        <p>{{ dashboardError }}</p>
        <button @click="fetchDashboardData" class="rounded-lg border border-red-300 px-4 py-2 font-medium transition hover:bg-red-100">Try again</button>
      </div>

      <div v-else-if="isLoading" class="rounded-2xl border border-stone-200 bg-white py-16 text-center text-sm text-gray-500" role="status" aria-live="polite">
        <div class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-black"></div>
        Loading your store overview…
      </div>

      <template v-else>
        <DashboardMetrics :data="dashboardData" />

        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="space-y-6 lg:col-span-2">
            <RevenueChart />
            <TopProducts :products="dashboardData.topProducts" />
          </div>

          <div class="space-y-6">
            <LowStockAlerts :items="dashboardData.lowStockItems" />
          </div>
        </div>

        <RecentOrders :orders="dashboardData.recentOrders" @refresh="fetchDashboardData" />
      </template>
    </div>

    </adminSidebar>
</template>

<!-- <RouterLink :to="{name: 'addproduct' }">Add Product</RouterLink> -->
