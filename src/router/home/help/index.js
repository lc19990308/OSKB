export default [
  {
    path: 'ccie',
    name: 'help-ccie',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '帮助中心',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/help/ccie/index.vue')
  },
  {
    path: 'agency',
    name: 'help-agency',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '帮助中心',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/help/agency/index.vue')
  },
  {
    path: 'scan',
    name: 'help-scan',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '帮助中心',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/help/scan/index.vue')
  },
  {
    path: 'password',
    name: 'help-password',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '帮助中心',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/help/password/index.vue')
  },
  {
    path: 'upgrade',
    name: 'help-upgrade',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '帮助中心',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/help/upgrade/index.vue')
  }
]
