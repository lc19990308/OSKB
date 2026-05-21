export default [
  {
    path: 'main',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '消息通知',
          path: ''
        }
      ]
    },
    redirect: '/message/main/list',
    component: () => import('@/views/home/message/main.vue'),
    children: [
      {
        path: 'list',
        meta: {
          requiresAuth: false,
          keepAlive: true,
          breadcrumb: [
            {
              name: '消息通知',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/message/list/main.vue')
      },
      {
        path: 'conf',
        meta: {
          requiresAuth: false,
          keepAlive: true,
          breadcrumb: [
            {
              name: '消息通知',
              path: ''
            }
          ]
        },
        component: () => import('@/views/home/message/conf/index')
      }
    ]
  },
  {
    path: 'detail',
    meta: {
      requiresAuth: false,
      keepAlive: false,
      breadcrumb: [
        {
          name: '消息详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/message/list/detail/index.vue')
  }
]
