export default [
  {
    path: 'login',
    name: 'safety/login',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '告警配置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/safety/login/ModifyRiskLevelComponent.vue')
  },
  {
    path: 'dialog',
    name: 'safety/dialog',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '告警配置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/safety/dialog/ModifyRiskLevelComponent.vue')
  }
]
