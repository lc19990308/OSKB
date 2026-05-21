import WarnConf from '@/router/home/system/warnConf/index'
import docking from '@/router/home/system/docking/index'

export default [
  {
    path: 'safety',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/safety/index.vue')
  },
  {
    path: 'warnConf',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    redirect: '/system/warnConf/list',
    component: () => import('@/views/home/system/warnConf/index.vue'),
    children: WarnConf
  },
  {
    path: 'backups',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/backups/index.vue')
  },
  {
    path: 'webConf',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/webConf/index.vue')
  },
  {
    path: 'rule',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/rule/index.vue')
  },
  {
    path: 'docking',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    children: docking,
    component: () => import('@/views/home/system/docking/index.vue')
  },
  {
    path: 'backstage',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '后台配置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/backstage/index.vue')
  },
  {
    path: 'cleanup',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '系统清理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/cleanup/index.vue')
  },
  {
    path: 'taskQueue',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '任务队列',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/taskQueue/index.vue')
  }
]
