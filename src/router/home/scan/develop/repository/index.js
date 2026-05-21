import Main from '@/router/home/scan/develop/repository/main'
import Svn from '@/router/home/scan/develop/repository/svn'
import Git from '@/router/home/scan/develop/repository/git'
import firefly from '@/router/home/scan/develop/repository/firefly'

export default [
  {
    path: 'list',
    name: 'ScanDevelopRepositoryList',
    meta: {
      requiresAuth: false,
      keepAlive: true,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        }
      ]
    },
    redirect: '/scan/develop/repository/list/git',
    component: () => import('@/views/home/scan/develop/repository/main.vue'),
    children: Main
  },
  ...Svn,
  ...Git,
  ...firefly
]
