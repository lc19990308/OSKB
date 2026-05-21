export default [
  {
    path: 'list',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '项目管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/project/conf/main.vue')
  },
  {
    path: 'details',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '项目管理',
          path: '/project/conf/list'
        },
        {
          name: '项目详情',
          path: ''
        }
      ]
    },
    redirect: '/project/conf/details/overview',
    component: () => import('@/views/home/project/conf/detail/index.vue'),
    children: [
      {
        path: 'overview',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '项目管理',
              path: '/project/conf/list'
            },
            {
              name: '项目详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/project/conf/detail/overview.vue')
      },
      {
        path: 'app',
        meta: {
          requiresAuth: false,
          breadcrumb: [
            {
              name: '项目管理',
              path: '/project/conf/list'
            },
            {
              name: '项目详情',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/project/conf/detail/app.vue')
      }
    ]
  }
]
