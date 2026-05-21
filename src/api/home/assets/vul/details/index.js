import fetch from '@/utils/fetch'

// 获取组件列表
export function componentList (data) {
  return fetch({
    url: '/oss/api-v1/dic/vul/affectedComponentList',
    method: 'get',
    params: data
  })
}
