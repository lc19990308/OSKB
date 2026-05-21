
export default [
  {
    path: 'list',
    name: 'AssetsVulList',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '漏洞风险管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/assets/vul/main.vue')
  },
  {
    path: 'details',
    name: 'AssetsVulDetails',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '漏洞风险管理',
          path: '/assets/vul/list'
        },
        {
          name: '漏洞详情',
          path: ''
        }
      ]
    },
    redirect: '/assets/vul/details/component',
    component: () => import('@/views/home/assets/vul/details/index.vue'),
    children: [
      {
        path: 'component',
        name: 'AssetsVulDetailsComponent',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '漏洞风险管理',
              path: '/assets/vul/list'
            },
            {
              name: '漏洞详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/assets/vul/details/affect/component')
      },
      {
        path: 'app',
        name: 'AssetsVulDetailsApp',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '漏洞风险管理',
              path: '/assets/vul/list'
            },
            {
              name: '漏洞详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/assets/vul/details/affect/app')
      },
      {
        path: 'project',
        name: 'AssetsVulDetailsProject',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '漏洞风险管理',
              path: '/assets/vul/list'
            },
            {
              name: '漏洞详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/assets/vul/details/affect/project')
      }
    ]
  }
]
