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

const isLoading = ref(false);

onMounted(async () => {
  await fetchDashboardData();
});

async function fetchDashboardData() {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/Admin/dashboard-stats');
    
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    
    dashboardData.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
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
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500">Welcome back! Here's what's happening with your store.</p>
      </div>

      <!-- Key Metrics -->
      <DashboardMetrics :data="dashboardData" />

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <!-- Left: Charts (2 columns) -->
        <div class="lg:col-span-2 space-y-6">
          <RevenueChart />
          <TopProducts :products="dashboardData.topProducts" />
        </div>

        <!-- Right: Alerts & Widgets -->
        <div class="space-y-6">
          <LowStockAlerts :items="dashboardData.lowStockItems" />
        </div>
      </div>

      <!-- Recent Orders Table -->
      <RecentOrders 
        :orders="dashboardData.recentOrders"
        @refresh="fetchDashboardData"
      />
    </div>

    </adminSidebar>
</template>

<!-- <RouterLink :to="{name: 'addproduct' }">Add Product</RouterLink> -->