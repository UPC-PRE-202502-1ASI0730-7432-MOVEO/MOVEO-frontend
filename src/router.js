// Configuración básica de enrutador
import { createRouter, createWebHistory } from 'vue-router'
import RentalPage from '@/app/rental/components/index.vue'

const routes = [
  { path: '/', redirect: '/rentals' },
  { path: '/rentals', name: 'rentals', component: RentalPage },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div style="padding:2rem">Página no encontrada</div>' } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

