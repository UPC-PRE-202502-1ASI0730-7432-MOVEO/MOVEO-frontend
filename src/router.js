// Main Router Configuration with Nested Routes
import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/app/shared/views/dashboard-page.vue'
import PageNotFound from '@/app/shared/views/page-not-found.vue'
import { useUserStore } from '@/app/iam/application/user.store.js'

// Import nested route modules
import iamRoutes from '@/app/iam/presentation/iam-router.js'
import rentalRoutes from '@/app/rental/presentation/rental-router.js'
import adventureRoutes from '@/app/adventure/presentation/adventure-router.js'
import paymentRoutes from '@/app/payment/presentation/payment-router.js'
import supportRoutes from '@/app/support/presentation/support-router.js'

const routes = [
  // Root redirect - Start at login page
  { 
    path: '/', 
    redirect: '/auth/login',
    meta: { title: 'MOVEO' }
  },
  
  // Dashboard
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  
  // IAM Module (Identity and Access Management) - Auth routes
  {
    path: '/auth',
    children: iamRoutes
  },
  
  // Rental Module - Vehicle browsing and rental management
  {
    path: '/rental',
    children: rentalRoutes
  },
  
  // Adventure Module - Themed Travel Routes (Only for Renters)
  {
    path: '/adventure',
    children: adventureRoutes,
    meta: { requiresAuth: true, requiresRole: 'renter' }
  },
  
  // Payment Module
  {
    path: '/payments',
    children: paymentRoutes
  },
  
  // Support Module - Tickets and Customer Service (Only for Owners)
  {
    path: '/support',
    children: supportRoutes,
    meta: { requiresAuth: true, requiresRole: 'owner' }
  },
  
  // Legacy routes redirects for backwards compatibility
  { path: '/login', redirect: '/auth/login' },
  { path: '/register', redirect: '/auth/register' },
  { path: '/profile', redirect: '/auth/profile' },
  { path: '/rentals', redirect: '/rental/browse' },
  { path: '/my-rentals', redirect: '/rental/my-rentals' },
  { path: '/favorites', redirect: '/rental/favorites' },
  { path: '/my-vehicles', redirect: '/rental/my-vehicles' },
  { path: '/add-vehicle', redirect: '/rental/add-vehicle' },
  { path: '/rental-requests', redirect: '/rental/rental-requests' },
  { path: '/earnings', redirect: '/rental/earnings' },
  { path: '/my-payments', redirect: '/payments/my-payments' },
  
  // 404 Not Found
  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: PageNotFound,
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard - similar to your professor's example
router.beforeEach((to, from, next) => {
  console.log(`🚀 Navigation from ${from.name || 'unknown'} to ${to.name || to.path}`)
  
  // Set page title
  const baseTitle = 'MOVEO'
  document.title = to.meta?.title ? `${baseTitle} - ${to.meta.title}` : baseTitle
  
  // Check authentication
  const userStore = useUserStore()
  const requiresAuth = to.meta?.requiresAuth
  const requiresRole = to.meta?.requiresRole
  
  if (requiresAuth && !userStore.isAuthenticated) {
    console.warn('⚠️ Authentication required, redirecting to login')
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (requiresRole && userStore.userRole.value !== requiresRole) {
    console.warn(`⚠️ Role ${requiresRole} required, user has ${userStore.userRole.value}`)
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router