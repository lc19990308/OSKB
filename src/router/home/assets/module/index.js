export default [
  {
    path: 'list',
    name: 'AssetsModuleList',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '组件风险管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/assets/module/main.vue')
  },
  {
    path: 'details',
    name: 'AssetsModuleDetails',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '组件风险管理',
          path: '/assets/module'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/assets/module/details/index.vue')
  }
]
