export default [
  {
    path: 'list',
    name: 'ScanDevelopIntegrationList',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '集成部署',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/integration/main.vue')
  },
  {
    path: 'details',
    name: 'ScanDevelopIntegrationDetails',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '集成部署',
          path: '/scan/develop/integration/list'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    redirect: '/scan/develop/integration/details/component',
    component: () => import('@/views/home/scan/develop/integration/details/ModifyRiskLevelComponent.vue'),
    children: [
      {
        path: 'component',
        name: 'ScanDevelopIntegrationDetailsComponent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '集成部署',
              path: '/scan/develop/integration/list'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/integration/details/component/ModifyRiskLevelComponent.vue')
      },
      {
        path: 'vul',
        name: 'ScanDevelopIntegrationDetailsVul',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '集成部署',
              path: '/scan/develop/integration/list'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/integration/details/vul/ModifyRiskLevelComponent.vue')
      },
      {
        path: 'license',
        name: 'ScanDevelopIntegrationDetailsLicense',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '集成部署',
              path: '/scan/develop/integration/list'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/integration/details/license/ModifyRiskLevelComponent.vue')
      }
    ]
  },
  {
    path: 'compare',
    name: 'ScanDevelopIntegrationCompare',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '集成部署',
          path: '/scan/develop/integration/list'
        },
        {
          name: '结果对比',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/integration/compare')
  }
]
