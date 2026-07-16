export default [
  {
    path: 'list',
    name: 'ScanBinaryList',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '二进制成分分析',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/binary/main.vue')
  }
]
