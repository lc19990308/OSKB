import fetch from '@/utils/fetch'

// 获取详情
export function licenseDetail (data, token) {
  return fetch({
    url: `/oss/api-v1/open-api/dic/license/detail/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    },
    headers: { token }
  })
}

// 获取许可证下组件列表
export function componentList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/dic/license/affectedComponentList',
    method: 'get',
    params: data,
    headers: { token }
  })
}
