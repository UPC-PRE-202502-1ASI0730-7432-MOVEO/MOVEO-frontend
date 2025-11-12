// Adventure Module Routes
export default [
  {
    path: '',
    name: 'adventure-routes',
    component: () => import('./views/adventure-routes.vue'),
    meta: { 
      title: 'Adventure Routes',
      requiresAuth: false 
    }
  },
  {
    path: ':id',
    name: 'adventure-route-detail',
    component: () => import('./views/adventure-route-detail.vue'),
    props: true,
    meta: { 
      title: 'Route Detail',
      requiresAuth: false 
    }
  }
]
