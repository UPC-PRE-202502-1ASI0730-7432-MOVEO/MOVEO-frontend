// Adventure Module Routes
export default [
  {
    path: '',
    name: 'adventures',
    component: () => import('../components/views/adventure-list.vue'),
    meta: { title: 'Adventure List' }
  },
  {
    path: 'new',
    name: 'adventure-new',
    component: () => import('../components/views/adventure-form.vue'),
    meta: { title: 'New Adventure' }
  },
  {
    path: 'edit/:id',
    name: 'adventure-edit',
    component: () => import('../components/views/adventure-form.vue'),
    props: true,
    meta: { title: 'Edit Adventure' }
  }
]
