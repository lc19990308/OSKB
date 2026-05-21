/*
* 漏洞风险管理开放详情界面
* /open/assets/vul/details?dicVulId={漏洞id}&token={token}
*/
export default [
  {
    path: 'component',
    name: 'OpenAssetsVulDetailsComponent',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '漏洞风险管理',
          path: ''
        },
        {
          name: '漏洞详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/open/assets/vul/details/affect/component')
  },
  {
    path: 'app',
    name: 'OpenAssetsVulDetailsApp',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '漏洞风险管理',
          path: ''
        },
        {
          name: '漏洞详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/open/assets/vul/details/affect/app')
  },
  {
    path: 'project',
    name: 'OpenAssetsVulDetailsProject',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '漏洞风险管理',
          path: ''
        },
        {
          name: '漏洞详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/open/assets/vul/details/affect/project')
  }
]
