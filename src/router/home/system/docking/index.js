
export default [
  {
    path: 'blueWhale',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/docking/blueWhale/index')
  },
  {
    path: 'ldap',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/docking/ldap/index')
  },
  {
    path: 'zenTao',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/docking/zenTao/index')
  },
  {
    path: 'jira',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/docking/jira/index')
  }
]
