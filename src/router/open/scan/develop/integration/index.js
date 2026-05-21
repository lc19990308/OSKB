/*
* 集成部署开放详情界面
* /jenkins/details?taskId={taskId}&token={token}&sign={sign}
*/
export default [
  {
    path: 'component',
    name: 'JenkinsDetailsComponent',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '集成部署',
          path: '/scan/develop/integration/list'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/open/scan/develop/integration/details/component')
  },
  {
    path: 'vul',
    name: 'JenkinsDetailsDetailsVul',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '集成部署',
          path: '/scan/develop/integration/list'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/open/scan/develop/integration/details/vul')
  },
  {
    path: 'license',
    name: 'JenkinsDetailsDetailsLicense',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        },
        {
          name: '集成部署',
          path: '/scan/develop/integration/list'
        },
        {
          name: '查看详情',
          path: ''
        }
      ]
    },
    component: () => import('@/views/open/scan/develop/integration/details/license')
  }
]
