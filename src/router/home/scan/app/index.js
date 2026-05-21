import component from './component'

export default [
  {
    path: 'component',
    name: 'ScanAppComponent',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '组件依赖检测',
          path: ''
        }
      ]
    },
    redirect: '/scan/app/component/list',
    component: () => import('@/views/home/scan/app/component'),
    children: component
  }
]
