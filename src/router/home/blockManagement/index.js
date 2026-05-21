const breadcrumb = [
  {
    name: '阻断管理',
    path: ''
  },
  {
    name: '私有仓库阻断',
    path: ''
  }
]

export default [
  {
    path: 'main',
    name: 'blockManagement-main',
    component: () => import('@/views/home/blockManagement/main'),
    redirect: '/block-management/main/private',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '阻断管理',
          path: ''
        }
      ]
    },
    children: [
      {
        path: 'private',
        name: 'blockManagement-private',
        redirect: '/block-management/main/private/main/list',
        component: () => import('@/views/home/blockManagement/private'),
        meta: {
          requiresAuth: true,
          breadcrumb
        },
        children: [
          {
            path: 'main',
            name: 'blockManagement-private-main',
            redirect: '/block-management/main/private/main/list',
            component: () => import('@/views/home/blockManagement/private/main'),
            meta: {
              requiresAuth: true,
              breadcrumb
            },
            children: [
              {
                path: 'list',
                name: 'blockManagement-private-list',
                component: () => import('@/views/home/blockManagement/private/list'),
                meta: {
                  requiresAuth: true,
                  breadcrumb
                }
              },
              {
                path: 'rule',
                name: 'blockManagement-private-rule',
                component: () => import('@/views/home/blockManagement/private/rule'),
                meta: {
                  requiresAuth: true,
                  breadcrumb
                }
              },
              {
                path: 'conf',
                name: 'blockManagement-private-conf',
                component: () => import('@/views/home/blockManagement/private/conf'),
                meta: {
                  requiresAuth: true,
                  breadcrumb
                }
              }
            ]
          }
        ]
      }
    ]
  }
]
