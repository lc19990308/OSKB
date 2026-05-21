import fetch from '@/utils/fetch'

// 获取opensca token
export function getOpenScaToken (projectId, data = {}) {
  return fetch({
    url: `/oss/api-v1/asset/opensca/token/${projectId}`,
    method: 'get',
    params: { loading: false, ...data }
  })
}
