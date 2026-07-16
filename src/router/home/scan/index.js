import App from '@/router/home/scan/app'
import Node from '@/router/home/scan/node/index'
import Develop from '@/router/home/scan/develop/index'
import sbom from '@/router/home/scan/sbom/index'
import Binary from '@/router/home/scan/binary/index'

export default [
  {
    path: 'app',
    name: 'ScanApp',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '应用包威胁审查',
          path: ''
        }
      ]
    },
    redirect: '/scan/app/component/list',
    component: () => import('@/views/home/scan/app'),
    children: App
  },
  {
    path: 'sbom',
    name: 'ScanApp',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: 'SBOM风险扫描',
          path: ''
        }
      ]
    },
    redirect: '/scan/sbom/list',
    component: () => import('@/views/home/scan/sbom'),
    children: sbom
  },
  {
    path: 'binary',
    name: 'ScanBinary',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '二进制成分分析',
          path: ''
        }
      ]
    },
    redirect: '/scan/binary/list',
    component: () => import('@/views/home/scan/binary/index.vue'),
    children: Binary
  },
  {
    path: 'node',
    name: 'ScanNode',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '测试运行监控',
          path: ''
        }
      ]
    },
    redirect: '/scan/node/list',
    component: () => import('@/views/home/scan/node/index.vue'),
    children: Node
  },
  {
    path: 'develop',
    name: 'ScanDevelop',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '编码实现分析',
          path: ''
        }
      ]
    },
    redirect: '/scan/develop/repository/list',
    component: () => import('@/views/home/scan/develop/index.vue'),
    children: Develop
  }
]
