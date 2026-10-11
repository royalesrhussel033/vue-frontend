<script setup>
import { ref, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartData = ref(null);
const isLoading = ref(false);

onMounted(async () => {
  await fetchRevenueData();
});

async function fetchRevenueData() {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:8000/api/Admin/revenue-stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch revenue data');

    const data = await response.json();
    
    chartData.value = {
      labels: data.dates, // ['Jan', 'Feb', 'Mar', ...]
      datasets: [
        {
          label: 'Revenue',
          data: data.revenues, // [1000, 2500, 1800, ...]
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: '#4f46e5',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching revenue data:', error);
  } finally {
    isLoading.value = false;
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        font: { size: 14 },
        color: '#6b7280'
      }
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '₱' + value.toLocaleString();
        }
      }
    }
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">📈 Revenue Trend</h2>
    
    <div v-if="isLoading" class="text-center py-8 text-gray-500">
      Loading chart...
    </div>
    
    <Line 
      v-else-if="chartData" 
      :data="chartData" 
      :options="chartOptions"
      style="height: 300px;"
    />
    
    <div v-else class="text-center py-8 text-gray-500">
      No data available
    </div>
  </div>
</template>