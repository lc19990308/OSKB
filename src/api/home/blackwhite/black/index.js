import fetch from '@/utils/fetch'

// 获取组件黑名单列表
export function blackList (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBlackList/list',
    method: 'get',
    params: data
  })
}

// 导出组件
export function exportComponent (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBlackList/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 批量修改组件忽略信息状态
export function changeStatus (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBlackList/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 获取黑名单组件风险等级对应数量饼状图
export function componentLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBlackList/securityLevelPie',
    method: 'get',
    params: data
  })
}

// 获取风险组件TOP10柱状图
export function seriousTopChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/securityLevelBarTop10',
    method: 'get',
    params: data
  })
}
