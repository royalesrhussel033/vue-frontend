<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import adminSidebar from '@/components/adminSidebar.vue';

axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

const contacts = ref([])
const loading = ref(false)
const errors = ref('')

// Track which contact card is currently expanded
const expandedCardId = ref(null)

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

// Function to handle opening/closing a card
const toggleCard = (id) => {
    if (expandedCardId.value === id) {
        expandedCardId.value = null
    } else {
        expandedCardId.value = id
    }
}

async function getAdminContact() {
    loading.value = true
    errors.value = ''
    try {
        const response = await axios.get('/Admin/adminContact')
        contacts.value = response.data
    } catch (err) {
        errors.value = err.response?.data?.message || 'Failed to load contacts.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    getAdminContact()
})
</script>

<template>
    <adminSidebar>
        <div class="w-full p-6  mx-auto"> 
            <div class="flex justify-between items-center mb-8 pb-4 border-b border-gray-200"> 
                <h1 class="text-3xl font-bold text-gray-800">Customer Contacts</h1> 
            </div>

            <div v-if="loading" class="text-gray-600 flex items-center justify-center p-12">
                <p class="animate-pulse font-medium">Loading contacts...</p>
            </div>

            <div v-else-if="errors" class="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                {{ errors }}
            </div>

            <div v-else class="space-y-4">
                <div 
                    v-for="contact in contacts" 
                    :key="contact.id"
                    class="bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-sm"
                    :class="expandedCardId === contact.id ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-400'"
                >
                    <button 
                        @click="toggleCard(contact.id)"
                        class="cursor-pointer w-full text-left p-5 focus:outline-none flex justify-between items-start gap-4 select-none"
                    >
                        <div class="flex-1 min-w-0">
                            <div class="text-base font-semibold text-gray-900 truncate">
                                {{ contact.email }}
                            </div>
                            <div class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <span>{{ contact.name }}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 shrink-0 text-sm text-gray-400 mt-0.5">
                            <span class="hidden sm:inline">{{ formatDate(contact.created_at).split(',')[0] }}</span>
                            <div>
                                <svg v-if="expandedCardId === contact.id" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><path d="m18 15-6-6-6 6"/></svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                    </button>

                    <div 
                        v-if="expandedCardId === contact.id" 
                        class="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50"
                    >
                        <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Message Content
                        </div>
                        
                        <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-100 shadow-inner">
                            {{ contact.message }}
                        </p>

                        <div class="text-xs text-gray-400 mt-3 flex justify-between items-center">
                            <span>Sent on: {{ formatDate(contact.created_at) }}</span>
                            <a 
                                :href="`mailto:${contact.email}?subject=Regarding your inquiry to Thrifting Genix`"
                                class="px-4 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors shadow-sm"
                            >
                                Reply via Email
                            </a>
                        </div>
                    </div>
                </div>

                <div v-if="contacts.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed text-gray-500 italic">
                    No contact messages found.
                </div>
            </div>
        </div>
    </adminSidebar>
</template>