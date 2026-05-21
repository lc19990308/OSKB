export default [
  {
    path: 'list',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/warnConf/main.vue')
  }
]
