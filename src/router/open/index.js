import Jenkins from '@/router/open/scan/develop/integration'
import openVul from '@/router/open/assets/vul'
import openLicense from '@/router/open/assets/license'

export default [
  {
    path: '/jenkins/details',
    name: 'JenkinsDetails',
    meta: {
      requiresAuth: false
    },
    component: () => import('@/views/open/scan/develop/integration/details'),
    redirect: '/jenkins/details/component',
    children: Jenkins
  },
  {
    path: '/open/assets/vul/details',
    name: 'OpenAssetsVulDetails',
    meta: {
      requiresAuth: false
    },
    component: () => import('@/views/open/assets/vul/details'),
    redirect: '/open/assets/vul/details/component',
    children: openVul
  },
  {
    path: '/open/assets/license/details',
    name: 'OpenAssetsLicenseDetails',
    meta: {
      requiresAuth: false
    },
    component: () => import('@/views/open/assets/license/details'),
    redirect: '/open/assets/license/details/component',
    children: openLicense
  }
]
