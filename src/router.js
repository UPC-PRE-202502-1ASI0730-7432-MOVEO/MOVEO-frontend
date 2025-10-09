// Configuración básica de enrutador
import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/app/shared/views/dashboard-page.vue'
import RentalPage from '@/app/rental/presentation/views/rental-page.vue'
import PageNotFound from '@/app/shared/views/page-not-found.vue'
import AdventureList from '@/app/adventure/components/views/adventure-list.vue'
import AdventureForm from '@/app/adventure/components/views/adventure-form.vue'
import PaymentsView from '@/app/payment/components/views/payments-view.vue'
import { useUserStore } from '@/app/iam/application/user.store.js'

const routes = [
  // Redirect root to dashboard based on role
  { 
    path: '/', 
    redirect: '/dashboard'
  },
  
  // Dashboard (dinámico según rol)
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  
  // Rutas de Autenticación (sin layout principal)
  { 
    path: '/login', 
    name: 'login', 
    component: () => import('@/app/iam/views/login-page.vue'),
    meta: { requiresAuth: false, hideLayout: true }
  },
  { 
    path: '/register/select-role', 
    name: 'register-select-role', 
    component: () => import('@/app/iam/views/role-selection-page.vue'),
    meta: { requiresAuth: false, hideLayout: true }
  },
  { 
    path: '/register/renter', 
    name: 'register-renter', 
    component: () => import('@/app/iam/views/register-renter-page.vue'),
    meta: { requiresAuth: false, hideLayout: true }
  },
  { 
    path: '/register/owner', 
    name: 'register-owner', 
    component: () => import('@/app/iam/views/register-owner-page.vue'),
    meta: { requiresAuth: false, hideLayout: true }
  },
  // Redirect old register route to new role selection
  { 
    path: '/register', 
    redirect: '/register/select-role'
  },
  
  // Rutas para Clientes (Renters)
  { path: '/rentals', name: 'rentals', component: RentalPage, meta: { role: 'renter' } },
  { path: '/my-rentals', name: 'my-rentals', component: () => import('@/app/rental/presentation/views/my-rentals-page.vue'), meta: { role: 'renter' } },
  { path: '/favorites', name: 'favorites', component: () => import('@/app/shared/views/coming-soon.vue'), meta: { role: 'renter' } },
  
  // Rutas para Propietarios (Owners)
  { 
    path: '/my-vehicles', 
    name: 'my-vehicles', 
    component: () => import('@/app/rental/presentation/views/my-vehicles-page.vue'), 
    meta: { role: 'owner' } 
  },
  { 
    path: '/vehicles/:id', 
    name: 'vehicle-detail', 
    component: () => import('@/app/rental/presentation/views/vehicle-detail-page.vue'), 
    props: true, 
    meta: { requiresAuth: true } 
  },
  { path: '/add-vehicle', name: 'add-vehicle', component: () => import('@/app/shared/views/coming-soon.vue'), meta: { role: 'owner' } },
  { path: '/rental-requests', name: 'rental-requests', component: () => import('@/app/shared/views/coming-soon.vue'), meta: { role: 'owner' } },
  { path: '/earnings', name: 'earnings', component: () => import('@/app/shared/views/coming-soon.vue'), meta: { role: 'owner' } },
  
  // Rutas de Adventures
  {
    path: '/adventures',
    name: 'adventures',
    component: AdventureList,
    meta: { title: 'Adventure List' }
  },
  {
    path: '/adventures/new',
    name: 'adventure-new',
    component: AdventureForm,
    meta: { title: 'New Adventure' }
  },
  {
    path: '/adventures/edit/:id',
    name: 'adventure-edit',
    component: AdventureForm,
    props: true,
    meta: { title: 'Edit Adventure' }
  },

  // Rutas de Payments
  {
    path: '/payments',
    name: 'payments',
    component: PaymentsView,
    meta: { title: 'Payment Module' }
  },
  {
    path: '/my-payments',
    name: 'my-payments',
    component: PaymentsView,
    meta: { requiresAuth: true, title: 'Historial de Pagos' }
  },

  // Rutas compartidas
  { path: '/profile', name: 'profile', component: () => import('@/app/iam/views/profile-page.vue') },
  
  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router