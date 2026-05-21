export default [
  {
    path: 'list',
    name: 'AssetsLicenseList',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '许可证风险管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/assets/license/main.vue')
  },
  {
    path: 'details',
    name: 'AssetsLicenseDetails',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '许可证风险管理',
          path: '/assets/license'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/assets/license/details/index.vue'),
    children: [
      {
        path: 'content',
        name: 'AssetsLicenseDetailsContent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '许可证风险管理',
              path: '/assets/license'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/assets/license/details/content.vue')
      },
      {
        path: 'component',
        name: 'AssetsLicenseDetailsComponent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '许可证风险管理',
              path: '/assets/license'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/assets/license/details/component.vue')
      },
      {
        path: 'intro',
        name: 'AssetsLicenseDetailsIntro',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '许可证风险管理',
              path: '/assets/license'
            },
            {
              name: '查看详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/assets/license/details/intro.vue')
      }
    ],
    redirect: '/assets/license/details/component'
  }
]
