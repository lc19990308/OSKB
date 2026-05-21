export default [
  {
    path: 'page',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: 'DevOps集成',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/integrated/devops/main')
  }
]
