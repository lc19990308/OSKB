export default [
  {
    path: 'git',
    name: 'ScanDevelopRepositoryGit',
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
    component: () => import('@/views/home/scan/develop/repository/git/index.vue')
  },
  {
    path: 'git/empty',
    name: 'git/empty',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/git'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/repository/git/details/empty.vue')
  },
  {
    path: 'git/details',
    name: 'ScanDevelopRepositoryGitDetails',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/git'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    redirect: '/scan/develop/repository/git/details/component',
    component: () => import('@/views/home/scan/develop/repository/git/details/index.vue'),
    children: [
      {
        path: 'component',
        name: 'ScanDevelopRepositoryGitDetailsComponent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/git'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/git/details/component/index.vue')
      },
      {
        path: 'vul',
        name: 'ScanDevelopRepositoryGitDetailsVul',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/git'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/git/details/vul/index.vue')
      },
      {
        path: 'license',
        name: 'ScanDevelopRepositoryGitDetailsLicense',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/git'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/git/details/license/index.vue')
      },
      {
        path: 'source',
        name: 'ScanDevelopRepositoryGitDetailsSource',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/git'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/git/details/source/index.vue')
      },
      {
        path: 'depend',
        name: 'ScanDevelopRepositoryGitDetailsDepend',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/git'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/git/details/depend/index.vue')
      }
    ]
  },
  {
    path: 'git/add',
    name: 'ScanDevelopRepositoryGitAdd',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/git'
        },
        {
          name: '添加仓库',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/repository/git/add/index.vue')
  },
  {
    path: 'git/batchAdd',
    name: 'ScanDevelopRepositoryGitBatchAdd',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/git'
        },
        {
          name: '添加仓库',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/repository/git/batchAdd'),
    redirect: '/scan/develop/repository/git/batchAdd/excel',
    children: [
      {
        path: 'excel',
        name: 'ScanDevelopRepositoryGitBatchAddExcel',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/git'
            },
            {
              name: '添加仓库',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/git/batchAdd/excel/index')
      },
      {
        path: 'warehouse',
        name: 'ScanDevelopRepositoryGitBatchAddWarehouse',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '编码实现分析',
              path: ''
            },
            {
              name: '代码库管理',
              path: '/scan/develop/repository/list/git'
            },
            {
              name: '添加仓库',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/develop/repository/git/batchAdd/warehouse/index')
      }
    ]
  },
  {
    path: 'git/config',
    name: 'ScanDevelopRepositoryGitConfig',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/git'
        },
        {
          name: '配置Git',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/repository/git/config/index.vue')
  },
  {
    path: 'git/compare',
    name: 'ScanDevelopRepositoryGitCompare',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '代码库管理',
          path: '/scan/develop/repository/list/git'
        },
        {
          name: '结果对比',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/develop/repository/git/compare')
  }
]
