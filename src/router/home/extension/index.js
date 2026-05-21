
export default [
  {
    path: 'jira',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '扩展配置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/extension/jira/index.vue')
  },
  {
    path: 'parse',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '扩展配置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/extension/parse/index.vue')
  }
]
