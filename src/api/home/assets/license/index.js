import fetch from '@/utils/fetch'

// 获取列表
export function licenseList (data) {
  return fetch({
    url: '/oss/api-v1/dic/license/list',
    method: 'get',
    params: data
  })
}

// 导出许可证列表Excel
export function exportLicense (data) {
  return fetch({
    url: '/oss/api-v1/dic/license/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 导出许可证组件列表Excel
export function exportComponent (data) {
  return fetch({
    url: '/oss/api-v1/dic/license/exportAffectedComponent',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 获取许可证传染性等级饼状图
export function licenseLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/dic/license/securityLevelPie',
    method: 'get',
    params: data
  })
}

// 获取许可证传染性类型饼状图
export function licenseTypeChart (data) {
  return fetch({
    url: '/oss/api-v1/dic/license/numBarTop10',
    method: 'get',
    params: data
  })
}

// 获取许可证下组件列表
export function componentList (data) {
  return fetch({
    url: '/oss/api-v1/dic/license/affectedComponentList',
    method: 'get',
    params: data
  })
}
