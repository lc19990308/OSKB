import Module from '@/router/home/assets/module'
import License from '@/router/home/assets/license'
import Vul from '@/router/home/assets/vul'

export default [
  {
    path: 'module',
    name: 'AssetsModule',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '组件风险管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/assets/module/index.vue'),
    redirect: '/assets/module/list',
    children: Module
  },
  {
    path: 'vul',
    name: 'AssetsVul',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '漏洞风险管理',
          path: ''
        }
      ]
    },
    redirect: '/assets/vul/list',
    component: () => import('@/views/home/assets/vul/index.vue'),
    children: Vul
  },
  {
    path: 'license',
    name: 'AssetsLicense',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '许可证风险管理',
          path: ''
        }
      ]
    },
    redirect: '/assets/license/list',
    component: () => import('@/views/home/assets/license/index.vue'),
    children: License
  }
]
