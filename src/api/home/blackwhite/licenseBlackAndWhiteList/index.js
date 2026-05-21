import fetch from '@/utils/fetch'

// 获取许可证黑白名单列表
export function getLicenseBlackWhiteList (data) {
  return fetch({
    url: '/oss/api-v1/data/licenseBlackWhiteList/list',
    method: 'get',
    params: data
  })
}

// 导出许可证黑白名单
export function exportLicenseBlackWhiteList (data) {
  return fetch({
    url: '/oss/api-v1/data/licenseBlackWhiteList/export/excel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 批量删除许可证黑白名单
export function deleteLicenseBlackWhiteList (data) {
  return fetch({
    url: '/oss/api-v1/data/licenseBlackWhiteList/delete/batch',
    method: 'post',
    data: data
  })
}

// 快速添加——获取许可证黑白名单列表
export function getAddLicenseBlackWhiteList (data) {
  return fetch({
    url: '/oss/api-v1/data/licenseBlackWhiteList/add/list',
    method: 'get',
    params: data
  })
}

// 快速添加许可证黑白名单
export function batchAddLicenseBlackWhiteList (data) {
  return fetch({
    url: '/oss/api-v1/data/licenseBlackWhiteList/add/batch',
    method: 'post',
    data: data
  })
}
