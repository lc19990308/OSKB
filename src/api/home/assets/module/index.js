import fetch from '@/utils/fetch'

// 组件列表
export function componentList (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/list',
    method: 'get',
    params: data
  })
}

// 分页获取组件风险管理列表
export function riskComponentList (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/management/list',
    method: 'get',
    params: data
  })
}

// 分页获取依赖路径统计列表
export function componentDependencyList (data, loading) {
  return fetch({
    url: '/oss/api-v1/asset/component/management/dependency/list',
    method: 'get',
    params: data,
    data: {
      loading
    }
  })
}

// 组件详情中的 - 分页获取依赖路径统计列表
export function dependencyList (data, loading) {
  return fetch({
    url: '/oss/api-v1/task/dependency/list',
    method: 'get',
    params: data,
    data: {
      loading
    }
  })
}

// 标记为
export function changeStatus (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 导出组件
export function exportComponent (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 生成组件风险管理的excel报告
export function componentManagementExcel (data) {
  return fetch({
    url: '/oss/api-v1/data/report/componentManagement/excel/generate',
    method: 'post',
    data: data
  })
}

// 生成报告
export function generateProjectGenerate (data) {
  return fetch({
    url: '/oss/api-v1/asset/project/excel/generate',
    method: 'post',
    data: data
  })
}

// 获取应用包下组件风险等级对应数量饼状图
export function componentLevelNumChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/securityLevelNumChart',
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

// 标记黑白名单
export function changeStatusBatch (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/management/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 获取语言列表
export function getLanguageList (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/management/language/all',
    method: 'get',
    params: data
  })
}
