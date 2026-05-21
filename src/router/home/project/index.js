import conf from '@/router/home/project/conf'
export default [
  {
    path: 'conf',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '项目管理',
          path: ''
        }
      ]
    },
    redirect: '/project/conf/list',
    component: () => import('@/views/home/project/conf/index.vue'),
    children: conf
  }
]
