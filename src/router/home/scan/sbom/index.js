export default [
  {
    path: 'list',
    name: 'SBOMList',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: 'SBOM风险扫描',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/sbom/main.vue')
  },
  {
    path: 'details',
    name: 'SBOMDetails',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: 'SBOM风险扫描',
          path: '/scan/sbom/list'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    redirect: '/scan/sbom/details/component',
    component: () => import('@/views/home/scan/sbom/details/index.vue'),
    children: [
      {
        path: 'component',
        name: 'SBOMDetailsComponent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: 'SBOM风险扫描',
              path: '/scan/sbom/list'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/sbom/details/component/index.vue')
      },
      {
        path: 'vul',
        name: 'SBOMDetailsVul',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: 'SBOM风险扫描',
              path: '/scan/sbom/list'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/sbom/details/vul/index.vue')
      },
      {
        path: 'license',
        name: 'SBOMDetailsLicense',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: 'SBOM风险扫描',
              path: '/scan/sbom/list'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/scan/sbom/details/license/index.vue')
      }
    ]
  },
  {
    path: 'compare',
    name: 'SBOMCompare',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: 'SBOM风险扫描',
          path: '/scan/sbom/list'
        },
        {
          name: '结果对比',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/scan/sbom/compare')
  }
]
