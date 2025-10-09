// Payment Module Routes
export default [
  {
    path: '',
    name: 'payments',
    component: () => import('../components/views/payments-view.vue'),
    meta: { title: 'Payment Module' }
  },
  {
    path: 'my-payments',
    name: 'my-payments',
    component: () => import('../components/views/payments-view.vue'),
    meta: { title: 'My Payments', requiresAuth: true }
  }
]
