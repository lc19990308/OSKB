export default [
  {
    path: 'list',
    name: 'ScanAppComponentList',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '应用包威胁审查',
          path: ''
        },
        {
          name: '组件依赖检测',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/app/component/main/main.vue')
  },
  {
    path: 'details',
    name: 'ScanAppComponentDetails',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '应用包威胁审查',
          path: ''
        },
        {
          name: '组件依赖检测',
          path: '/scan/app/component'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    redirect: '/scan/app/component/details/component',
    component: () => import('@/views/home/scan/app/component/details'),
    children: [
      {
        path: 'component',
        name: 'ScanAppComponentDetailsComponent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '应用包威胁审查',
              path: ''
            },
            {
              name: '组件依赖检测',
              path: '/scan/app/component'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/app/component/details/component')
      },
      {
        path: 'vul',
        name: 'ScanAppComponentDetailsVul',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '应用包威胁审查',
              path: ''
            },
            {
              name: '组件依赖检测',
              path: '/scan/app/component'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/app/component/details/vul')
      },
      {
        path: 'license',
        name: 'ScanAppComponentDetailsLicense',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '应用包威胁审查',
              path: ''
            },
            {
              name: '组件依赖检测',
              path: '/scan/app/component'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/app/component/details/license')
      },
      // {
      //   path: 'source',
      //   name: 'ScanAppComponentDetailsSource',
      //   meta: {
      //     requiresAuth: false,
      //     breadcrumb: [
      //       {
      //         name: '应用包威胁审查',
      //         path: ''
      //       },
      //       {
      //         name: '组件依赖检测',
      //         path: '/scan/app/component'
      //       },
      //       {
      //         name: '查看详情',
      //         path: ''
      //       }
      //     ]
      //   },
      //   component: () => import('@/views/home/scan/app/component/details/source')
      // },
      {
        path: 'depend',
        name: 'ScanAppComponentDetailsDepend',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '应用包威胁审查',
              path: ''
            },
            {
              name: '组件依赖检测',
              path: '/scan/app/component'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/app/component/details/depend/index.vue')
      }
    ]
  },
  {
    path: 'compare',
    name: 'ScanAppComponentCompare',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '应用包威胁审查',
          path: ''
        },
        {
          name: '组件依赖检测',
          path: '/scan/app/component'
        },
        {
          name: '结果对比',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/app/component/compare')
  }
]
