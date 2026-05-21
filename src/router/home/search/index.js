export default [
  {
    path: 'main',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '知识库查询',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/search/main.vue')
  },
  {
    path: 'details',
    meta: {
      requiresAuth: false,
      keepAlive: false,
      breadcrumb: [
        {
          name: '知识库查询',
          path: '/search/main'
        },
        {
          name: '组件详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/search/details/component/index.vue')
  },
  {
    path: 'license/details',
    meta: {
      requiresAuth: false,
      keepAlive: false,
      breadcrumb: [
        {
          name: '知识库查询',
          path: '/search/main'
        },
        {
          name: '许可证详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/search/details/license/index.vue')
  },
  {
    path: 'batch',
    meta: {
      requiresAuth: false,
      keepAlive: false,
      breadcrumb: [
        {
          name: '知识库查询',
          path: '/search/main'
        },
        {
          name: '风险扫描',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/search/batch/index.vue')
  }

]
