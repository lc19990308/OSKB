export default [
  {
    path: 'git',
    name: 'ScanDevelopRepositoryListGit',
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
    path: 'svn',
    name: 'ScanDevelopRepositoryListSvn',
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
    path: 'firefly',
    name: 'ScanDevelopRepositoryListFireFly',
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
  }
]
