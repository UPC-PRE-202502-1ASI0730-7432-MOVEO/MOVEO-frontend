// Configuración básica de enrutador
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/app/shared/views/home.vue'
import RentalPage from '@/app/rental/presentation/views/rental-page.vue'
import RegisterPage from '@/app/iam/views/register-page.vue'
import PageNotFound from '@/app/shared/views/page-not-found.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  
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
  { path: '/profile', name: 'profile', component: () => import('@/app/shared/views/coming-soon.vue') },
  { path: '/register', name: 'register', component: RegisterPage },
  
  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
