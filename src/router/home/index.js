import User from '@/router/home/user'
import Assets from '@/router/home/assets'
import Error from '@/router/home/error'
import Scan from '@/router/home/scan'
import BlackWhite from '@/router/home/blackWhite'
import blockManagement from '@/router/home/blockManagement'
import System from '@/router/home/system'
import Search from '@/router/home/search'
import Report from '@/router/home/report'
import ReportConfig from '@/router/home/reportConfig'
import Extension from '@/router/home/extension'
import Message from '@/router/home/message'
import project from '@/router/home/project'
import integrated from '@/router/home/integrated'
export default [
  {
    path: '404',
    component: () => import('@/views/home/error/404.vue')
  },
  {
    path: 'project',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '项目配置与管理',
          path: ''
        }
      ]
    },
    redirect: '/project/conf',
    component: () => import('@/views/home/project/index.vue'),
    children: project
  },
  {
    path: 'integrated',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '集成配置与管理',
          path: ''
        }
      ]
    },
    redirect: '/integrated/devops',
    component: () => import('@/views/home/integrated/index.vue'),
    children: integrated
  },
  {
    path: 'overview',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '安全态势分析',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/project/overview/index.vue')
  },
  {
    path: 'log',
    name: 'log',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '日志审计',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/log/index.vue')
  },
  {
    path: 'log/source-feature',
    name: 'sourceFeatureLog',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '日志审计',
          path: '/log'
        },
        {
          name: '源码特征检测流程',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/log/sourceFeature.vue')
  },
  {
    path: 'message',
    name: 'message',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '站内消息',
          path: ''
        }
      ]
    },
    redirect: '/message/main',
    component: () => import('@/views/home/message/index.vue'),
    children: Message
  },
  {
    path: 'user',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '账号管理',
          path: ''
        }
      ]
    },
    redirect: '/user/account',
    component: () => import('@/views/home/user/index.vue'),
    children: User
  },
  {
    path: 'assets',
    name: 'assets',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '制品分析与管理',
          path: ''
        }
      ]
    },
    redirect: '/assets/module',
    component: () => import('@/views/home/assets/index.vue'),
    children: Assets
  },
  {
    path: 'scan',
    name: 'scan',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: 'OSS审查与管理',
          path: ''
        }
      ]
    },
    redirect: '/scan/app',
    component: () => import('@/views/home/scan/index.vue'),
    children: Scan
  },
  {
    path: 'account',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '个人中心',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/account/index.vue')
  },
  {
    path: 'search',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '知识库查询',
          path: ''
        }
      ]
    },
    redirect: '/search/main',
    component: () => import('@/views/home/search/index.vue'),
    children: Search
  },
  {
    path: 'system',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '系统设置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/index.vue'),
    children: System
  },
  {
    path: 'report',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '报告管理',
          path: ''
        }
      ]
    },
    redirect: '/report/list',
    component: () => import('@/views/home/report/report/index.vue'),
    children: Report
  },
  {
    path: 'report-config',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '报告配置',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/report/config/main'),
    redirect: '/report-config/template',
    children: ReportConfig
  },
  {
    path: 'guide',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '功能引导',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/guide/index.vue')
  },
  {
    path: 'extension',
    meta: {
      requiresAuth: false,
      breadcrumb: [
        {
          name: '扩展配置',
          path: ''
        }
      ]
    },
    redirect: '/extension/jira',
    component: () => import('@/views/home/extension/index.vue'),
    children: Extension

  },
  {
    path: 'update',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '关于系统',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/system/update/index.vue')
  },
  {
    path: 'black-white',
    name: 'BlackWhite',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '组件黑白名单',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/blackWhite'),
    children: BlackWhite
  },
  {
    path: 'block-management',
    name: 'blockManagement',
    meta: {
      requiresAuth: true,
      breadcrumb: [
        {
          name: '阻断管理',
          path: ''
        }
      ]
    },
    component: () => import('@/views/home/blockManagement'),
    children: blockManagement
  },
  ...Error
]
