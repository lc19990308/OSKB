export default [
  {
    path: 'firefly',
    name: 'ScanDevelopRepositoryFireFly',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/repository/firefly/index.vue')
  },
  {
    path: 'firefly/details',
    name: 'ScanDevelopRepositoryFireFlyDetails',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/firefly'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    redirect: '/scan/develop/repository/firefly/details/component',
    component: () => import('@/views/home/scan/develop/repository/firefly/details/index.vue'),
    children: [
      {
        path: 'component',
        name: 'ScanDevelopRepositoryFireFlyDetailsComponent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/firefly'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/firefly/details/component/index.vue')
      },
      {
        path: 'vul',
        name: 'ScanDevelopRepositoryFireFlyDetailsVul',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/firefly'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/firefly/details/vul/index.vue')
      },
      {
        path: 'license',
        name: 'ScanDevelopRepositoryFireFlyDetailsLicense',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/firefly'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/firefly/details/license/index.vue')
      },
      {
        path: 'source',
        name: 'ScanDevelopRepositoryFireFlyDetailsSource',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/firefly'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/firefly/details/source/index.vue')
      },
      {
        path: 'depend',
        name: 'ScanDevelopRepositoryFireFlyDetailsDepend',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/firefly'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/firefly/details/depend/index.vue')
      }
    ]
  },
  {
    path: 'firefly/add',
    name: 'ScanDevelopRepositoryFireFlyAdd',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/firefly'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    redirect: '/scan/develop/repository/firefly/add/quick',
    component: () => import('@/views/home/scan/develop/repository/firefly/add/index'),
    children: [
      {
        path: 'quick',
        name: 'ScanDevelopRepositoryFireFlyAddQuick',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/firefly'
            },
            {
              name: '添加仓库',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/firefly/add/quick/main.vue')
      },
      {
        path: 'batch',
        name: 'ScanDevelopRepositoryFireFlyAddBatch',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/firefly'
            },
            {
              name: '添加仓库',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/firefly/add/batch/main.vue')
      }
    ]
  },
  {
    path: 'firefly/compare',
    name: 'ScanDevelopRepositoryFireFlyCompare',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/firefly'
        },
        {
          name: '结果对比',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/repository/firefly/compare')
  }
]
