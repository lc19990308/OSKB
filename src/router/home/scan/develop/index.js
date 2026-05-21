import Repository from '@/router/home/scan/develop/repository'
// import Integration from '@/router/home/scan/develop/integration'

export default [
  {
    path: 'repository',
    name: 'ScanDevelopRepository',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        }
      ]
    },
    redirect: '/scan/develop/repository/list',
    component: () => import('@/views/home/scan/develop/repository/index.vue'),
    children: Repository
  }
]
