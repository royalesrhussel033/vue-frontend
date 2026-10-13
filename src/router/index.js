import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/about.vue')
    },
    {
        path: '/shop',
        name: 'shop',
        component: () => import('../views/shop.vue')
    },
    {
        path: '/shop/:id',
        name: 'shopId',
        component: () => import('../views/shop.vue')
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('../views/cart.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/loginCard.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/components/registerCard.vue')
    },
    {
        path: '/dashboard',
        name: 'Admindashboard',
        component: () => import('../adminviews/dashboard.vue'),
        meta: { requiresAuth: true, requiresRole: 'admin', isAdmin: true }
    },
    {
        path: '/manageproducts/addproduct',
        name: 'addproduct',
        component: () => import('../adminviews/addproduct.vue'),
        meta: { requiresAuth: true, requiresRole: 'admin', isAdmin: true }
    },
    {
        path: '/manageproducts/addcategories',
        name: 'addcategories',
        component: () => import('../adminviews/addcategories.vue'),
        meta: { requiresAuth: true, requiresRole: 'admin', isAdmin: true }
    },
    {
        path: '/manageproducts',
        name: 'manageproducts',
        component: () => import('../adminviews/manageproducts.vue'),
        meta: { requiresAuth: true, requiresRole: 'admin', isAdmin: true }
    },
    {
        path: '/manageproducts/:id/editproduct',
        name: 'editproduct',
        component: () => import('../adminviews/editproduct.vue'),
        meta: { requiresAuth: true, requiresRole: 'admin', isAdmin: true }
    },
    {
        path: '/checkout',
        name: 'checkOut',
        component: () => import('../components/checkoutForm.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/adminOrders',
        name: 'Orders',
        component: () => import('../adminviews/adminOrders.vue'),
        meta: { requiresAuth: true, requiresRole: 'admin', isAdmin: true }
    },
    {
        path: '/myOrders',
        name: 'myOrders',
        component: () => import('../views/myOrders.vue'),
        meta: { requiresAuth: true}
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/profile.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/email-verified',
        name: 'emailVerified',
        component: () => import('../views/emailVerified.vue')
    },
    {
        path: '/reset-password',
        name: 'resetPassword',
        component: () => import('../views/resetPassword.vue')
    },
    {
        path: '/oauth-callback',
        name: 'oauthCallback',
        component: () => import('../views/oauthCallback.vue')
    },
    {
        path: '/Sales',
        name: 'Sales',
        component: () => import('../adminviews/adminSales.vue'),
        meta: { requiresAuth: true, requiresRole: 'admin', isAdmin: true }
    },
    {
        path: '/ContactUs',
        name: 'contactUs',
        component: () => import('../views/contact.vue')
    },
    {
        path: '/History',
        name: 'orderHistory',
        component: () => import('../views/orderHistory.vue'),
        meta: { requiresAuth: true}
    },
    {
        path: '/adminContact',
        name: 'contacts',
        component: () => import('../adminviews/adminContact.vue'),
        meta: { requiresAuth: true, requiresRole: 'admin', isAdmin: true}
    },
    {
        path: '/adminSizes',
        name: 'sizes',
        component: () => import('../adminviews/addsizes.vue'),
        meta: { requiresAuth: true, requiresRole: 'admin', isAdmin: true}
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return {top: 0}
    }
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    if (!authStore.user) {
        await authStore.init()
    }

    if (to.meta.requiresAuth && !authStore.user) {
        return next({ name: 'home'})
    }

    if (to.meta.requiresRole && authStore.user?.role !== to.meta.requiresRole) {
        if (authStore.user?.role === 'user') {
            return next ({ name: 'home' })
        } else {
            return next({ name: 'login'})
        }
    }
        next()
})

export default router