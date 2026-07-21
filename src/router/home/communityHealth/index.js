const breadcrumb = [
  {
    name: '编码实现分析',
    path: ''
  },
  {
    name: '社区健康评估',
    path: ''
  }
]

export default {
  path: 'community-health',
  name: 'CommunityHealth',
  meta: {
    requiresAuth: true,
    skipPermission: true,
    breadcrumb
  },
  component: () => import('@/views/home/communityHealth/index.vue')
}
