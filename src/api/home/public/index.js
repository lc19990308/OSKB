import fetch from '@/utils/fetch'

// 更改组件资产审计状态
export function changeAuditStatusBatch (data) {
  return fetch({
    url: `/oss/api-v1/asset/component/management/changeAuditStatusBatch`,
    method: 'post',
    data: data
  })
}


// 更改许可证资产审计状态
export function changeLicenseAuditStatusBatch (data) {
  return fetch({
    url: `/oss/api-v1/dic/license/changeAuditStatusBatch`,
    method: 'post',
    data: data
  })
}


// 标记组件黑白名单
export function changeStatusBatch (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/management/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 标记许可证黑白名单
export function markLicenseBlackWhiteList (data) {
  return fetch({
    url: '/oss/api-v1/data/licenseBlackWhiteList/mark',
    method: 'post',
    data: data
  })
}

// 标记许漏洞黑白名单
export function markVulBlackWhitelist (data) {
  return fetch({
    url: '/oss/api-v1/data/vulBlackWhitelist/mark',
    method: 'post',
    data: data
  })
}


// 修改许可证风险等级
export function customizeLicenseData (data) {
  return fetch({
    url: '/oss/api-v1/dic/license/customizeLicenseData',
    method: 'post',
    data: data
  })
}

// 修改漏洞风险等级
export function customizeVulData (data) {
  return fetch({
    url: '/oss/api-v1/data/vul/customizeVulData',
    method: 'post',
    data: data
  })
}
