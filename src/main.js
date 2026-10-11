import './assets/main.css'
import { useAuthStore } from './stores/auth'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './assets/main.css'

import App from './App.vue'
import router from './router'



createApp(App).use(router).use(createPinia()).use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
}).mount('#app');



const authStore = useAuthStore()
authStore.init()