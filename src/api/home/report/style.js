import fetch from '@/utils/fetch'

// 获取报告配置
export function getReportConf (data) {
  return fetch({
    url: '/oss/api-v1/data/report/templates/style',
    method: 'get',
    params: data
  })
}

// 设置报告配置
export function setReportConf (data) {
  console.log(data)
  return fetch({
    url: '/oss/api-v1/data/report/templates/style',
    method: 'put',
    data: data
  })
}

// 恢复默认配置
export function resetReportConf (data) {
  return fetch({
    url: '/oss/api-v1/data/report/templates/style/reset',
    method: 'put',
    data: data
  })
}
