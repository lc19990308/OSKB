import fetch from '@/utils/fetch'

// 获取详情
export function licenseDetail (data) {
  return fetch({
    url: `/oss/api-v1/dic/license/detail/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 许可证获取标记状态、审计状态
export function getLicenseStatus (data) {
  return fetch({
    url: `/oss/api-v1/dic/license/getLicenseStatus`,
    method: 'get',
    params: {
      loading: false,
      ...data
    }
  })
}
