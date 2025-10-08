// Configuración básica de enrutador
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/app/shared/views/home.vue'
import RentalPage from '@/app/rental/presentation/views/rental-page.vue'
import PageNotFound from '@/app/shared/views/page-not-found.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  
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
  { path: '/my-vehicles', name: 'my-vehicles', component: () => import('@/app/shared/views/coming-soon.vue'), meta: { role: 'owner' } },
  { path: '/add-vehicle', name: 'add-vehicle', component: () => import('@/app/shared/views/coming-soon.vue'), meta: { role: 'owner' } },
  { path: '/rental-requests', name: 'rental-requests', component: () => import('@/app/shared/views/coming-soon.vue'), meta: { role: 'owner' } },
  { path: '/earnings', name: 'earnings', component: () => import('@/app/shared/views/coming-soon.vue'), meta: { role: 'owner' } },
  

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
