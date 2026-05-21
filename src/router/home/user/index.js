export default [
  {
    path: 'account',
    name: 'user-account',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '账号管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/user/account/index.vue')
  },
  {
    path: 'power',
    name: 'user-power',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '账号管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/user/power/index.vue')
  },
  {
    path: 'role',
    name: 'user-role',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '账号管理',
          path: '/user/account'
        },
        {
          name: '角色管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/user/role/index.vue')
  }
]
