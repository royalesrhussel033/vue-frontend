<script setup>
    import { orderStore } from '@/stores/orders'
    import { storeToRefs } from 'pinia'
    import { onMounted } from 'vue'
    import adminSidebar from '@/components/adminSidebar.vue'

    const formatDate = (value) => {
    return new Date(value).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
    })
    }
    const orderSalesStore = orderStore()
    const { sales } = storeToRefs(orderSalesStore)


    onMounted(() => {
        orderSalesStore.fetchAdminSales()
    })

    // Dynamic color coding helper for payment status
    const getPaymentStatusClass = (status) => {
      if (!status) return 'bg-gray-100 text-gray-800';
      
      switch (status.toLowerCase()) {
        case 'paid':
        case 'completed':
          return 'bg-emerald-100 text-emerald-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'failed':
        case 'refunded':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
</script>

<template>
    <adminSidebar>
        
        <div class="p-6 md:p-8 w-full">
            
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Sales records</h1>
                    <p class="mt-1 text-sm text-gray-500">Review completed sales, items sold, and payment status.</p>
                </div>
            </div>

            <div class="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sale ID</th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product ID</th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Earnings</th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Status</th>
                            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="s in sales" :key="s.id" class="hover:bg-gray-50 transition-colors duration-150">
                            
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                #{{ s.id }}
                            </td>
                            
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                                #{{ s.order_id }}
                            </td>
                            
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                #{{ s.product_id }}
                            </td>
                            
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {{ s.quantity }} pcs
                            </td>
                            
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                ₱{{ Number(s.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                            </td>
                            
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="['px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', getPaymentStatusClass(s.payment_status)]">
                                    {{ s.payment_status || 'Not recorded' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {{ formatDate(s.created_at) }}
                            </td>
                            
                        </tr>

                        <tr v-if="!sales || sales.length === 0">
                            <td colspan="7" class="px-6 py-10 text-center text-sm text-gray-500">
                                No completed sales yet. Delivered orders will appear here.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

    </adminSidebar>
</template>