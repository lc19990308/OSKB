import devops from '@/router/home/integrated/devops/index'
export default [
  {
    path: 'devops',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: 'DevOps集成',
          path: ''
        }
      ]
    },
    redirect: '/integrated/devops/page',
    component: () => import('@/views/home/integrated/devops/index'),
    children: devops
  }
]
