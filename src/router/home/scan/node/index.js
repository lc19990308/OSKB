export default [
  {
    path: 'list',
    name: 'ScanNodeList',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '测试运行监控',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/node/main.vue')
  },
  {
    path: 'add',
    name: 'ScanNodeAdd',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '测试运行监控',
          path: '/scan/node/list'
        },
        {
          name: '添加节点',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/node/add/index.vue')
  },
  {
    path: 'details',
    name: 'ScanNodeDetails',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '测试运行监控',
          path: '/scan/node/list'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    redirect: '/scan/node/details/component',
    component: () => import('@/views/home/scan/node/details/index.vue'),
    children: [
      {
        path: 'component',
        name: 'ScanNodeDetailsComponent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '测试运行监控',
              path: '/scan/node'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/node/details/component/index.vue')
      },
      {
        path: 'vul',
        name: 'ScanNodeDetailsVul',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '测试运行监控',
              path: '/scan/node'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/node/details/vul/index.vue')
      },
      {
        path: 'license',
        name: 'ScanNodeDetailsLicense',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '测试运行监控',
              path: '/scan/node'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/node/details/license/index.vue')
      }
    ]
  },
  {
    path: 'compare',
    name: 'ScanNodeCompare',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '测试运行监控',
          path: '/scan/node/list'
        },
        {
          name: '结果对比',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/node/compare')
  }
]
