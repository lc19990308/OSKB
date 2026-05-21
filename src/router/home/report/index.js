export default [
  {
    path: 'list',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '报告管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/report/report/main.vue')
  },
  {
    path: 'config',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '报告管理',
          path: '/report/list'
        },
        {
          name: '模板配置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/report/report/config/index.vue')
  }
]
