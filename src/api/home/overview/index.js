import fetch from '@/utils/fetch'

// 获取安全态势项目汇总数据
export function projectSummary (data) {
  return fetch({
    url: '/oss/api-v1/system/securityPosture/projectSummary',
    method: 'get',
    params: data
  })
}

// 获取风险趋势分析折线图
export function riskTrendLine (data) {
  return fetch({
    url: '/oss/api-v1/system/securityPosture/riskTrendLine',
    method: 'get',
    params: data
  })
}

// 获取风险项目柱状图TOP10
export function riskProjectBar (data) {
  return fetch({
    url: '/oss/api-v1/system/securityPosture/riskProjectBarTop10',
    method: 'get',
    params: data
  })
}

// 获取风险组件柱状图TOP10
export function riskComponentBar (data) {
  return fetch({
    url: '/oss/api-v1/system/securityPosture/riskComponentBarTop10',
    method: 'get',
    params: data
  })
}

// 获取组件风险等级对应数量饼状图
export function componentSecurityLevelPie (data) {
  return fetch({
    url: '/oss/api-v1/system/securityPosture/componentSecurityLevelPie',
    method: 'get',
    params: data
  })
}

// 获取漏洞按风险等级分类及数量饼状图
export function vulSecurityLevelPie (data) {
  return fetch({
    url: '/oss/api-v1/system/securityPosture/vulSecurityLevelPie',
    method: 'get',
    params: data
  })
}

// 获取许可证风险等级饼状图
export function licenseSecurityLevelPie (data) {
  return fetch({
    url: '/oss/api-v1/system/securityPosture/licenseSecurityLevelPie',
    method: 'get',
    params: data
  })
}

// 获取风险漏洞柱状图top10
export function vulBar (data) {
  return fetch({
    url: '/oss/api-v1/system/securityPosture/vulBarTop10',
    method: 'get',
    params: data
  })
}

// 获取风险许可证柱状图top10
export function riskLicenseBar (data) {
  return fetch({
    url: '/oss/api-v1/system/securityPosture/riskLicenseBarTop10',
    method: 'get',
    params: data
  })
}
