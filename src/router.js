// Configuración básica de enrutador
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/app/shared/views/home.vue'
import RentalPage from '@/app/rental/presentation/views/rental-page.vue'
import RegisterPage from '@/app/iam/views/register-page.vue'
import PageNotFound from '@/app/shared/views/page-not-found.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/rentals', name: 'rentals', component: RentalPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
