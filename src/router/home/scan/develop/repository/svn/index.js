export default [
  {
    path: 'svn',
    name: 'ScanDevelopRepositorySvn',
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
    component: () => import('@/views/home/scan/develop/repository/svn/index.vue')
  },
  {
    path: 'svn/details',
    name: 'ScanDevelopRepositorySvnDetails',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/svn'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    redirect: '/scan/develop/repository/svn/details/component',
    component: () => import('@/views/home/scan/develop/repository/svn/details/index.vue'),
    children: [
      {
        path: 'component',
        name: 'ScanDevelopRepositorySvnDetailsComponent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/svn'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/svn/details/component/index.vue')
      },
      {
        path: 'vul',
        name: 'ScanDevelopRepositorySvnDetailsVul',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/svn'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/svn/details/vul/index.vue')
      },
      {
        path: 'license',
        name: 'ScanDevelopRepositorySvnDetailsLicense',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/svn'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/svn/details/license/index.vue')
      },
      {
        path: 'source',
        name: 'ScanDevelopRepositorySvnDetailsSource',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/svn'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/svn/details/source/index.vue')
      },
      {
        path: 'depend',
        name: 'ScanDevelopRepositorySvnDetailsDepend',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/svn'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/svn/details/depend/index.vue')
      }
    ]
  },
  {
    path: 'svn/add',
    name: 'ScanDevelopRepositorySvnAdd',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/svn'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    redirect: '/scan/develop/repository/svn/add/quick',
    component: () => import('@/views/home/scan/develop/repository/svn/add/index'),
    children: [
      {
        path: 'quick',
        name: 'ScanDevelopRepositorySvnAddQuick',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/svn'
            },
            {
              name: '添加仓库',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/svn/add/quick/main.vue')
      },
      {
        path: 'batch',
        name: 'ScanDevelopRepositorySvnAddBatch',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/svn'
            },
            {
              name: '添加仓库',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/svn/add/batch/main.vue')
      }
    ]
  },
  {
    path: 'svn/compare',
    name: 'ScanDevelopRepositorySvnCompare',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/svn'
        },
        {
          name: '结果对比',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/repository/svn/compare')
  }
]
