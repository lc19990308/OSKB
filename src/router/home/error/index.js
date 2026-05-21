export default [
  {
    path: '404',
    name: '404',
    meta: {
      requiresAuth: false
    },
    component: () => import('@/views/home/error/notFound.vue')
  },
  {
    path: 'notPermissions',
    name: 'notPermissions',
    meta: {
      requiresAuth: false
    },
    component: () => import('@/views/home/error/notPermissions.vue')
  }
]
