export default [
  {
    path: 'template',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '报告配置',
          path: ''
        },
        {
          name: '报告模板',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/report/config/template/main')
  },
  {
    path: 'style',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '报告配置',
          path: ''
        },
        {
          name: '报告样式',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/report/config/reportStyle')
  }
]
