/*
* 许可证风险管理开放详情界面
* /open/assets/license/details?id={许可证id}&token={token}
*/
export default [
  {
    path: 'content',
    name: 'OpenAssetsLicenseDetailsContent',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '许可证风险管理',
          path: ''
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/open/assets/license/details/content.vue')
  },
  {
    path: 'component',
    name: 'OpenAssetsLicenseDetailsComponent',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '许可证风险管理',
          path: ''
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/open/assets/license/details/component.vue')
  },
  {
    path: 'intro',
    name: 'OpenAssetsLicenseDetailsIntro',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '许可证风险管理',
          path: ''
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/open/assets/license/details/intro.vue')
  }
]
