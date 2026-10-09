<script setup>
import { ref, onMounted } from 'vue'
import myOrderItem from '@/components/myOrderItem.vue'
import OrderDetailsModal from '@/components/orderDetailsModal.vue'
import { orderStore } from '@/stores/orders'

const orders = ref([])
const showModal = ref(false)
const selectedOrderId = ref(null)

const store = orderStore()

onMounted(async () => {
  await store.getOrder(id)          // make sure your store has this
  orders.value = store.orders       // adapt names to your store
})

function onViewDetails(id) {
  selectedOrderId.value = id
  showModal.value = true
}
</script>

<template>
  <ul>
    <my-order-item
      v-for="o in orders"
      :key="o.id"
      :item="o"
      @viewDetails="onViewDetails"
    />
  </ul>

  <OrderDetailsModal
    v-if="showModal"
    :order-id="selectedOrderId"
    @close="showModal = false"
  />
</template>