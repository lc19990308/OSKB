import fetch from '@/utils/fetch'

// 获取idea插件列表
export function ideList (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/task/list',
    method: 'get',
    params: data
  })
}

// 删除idea
export function ideDelete (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/deleteBatch',
    method: 'post',
    data: data
  })
}

// 获取ide下组件风险等级对应数量饼状图
export function componentLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/component/securityLevelPie',
    method: 'get',
    params: data
  })
}

//  获取ide下漏洞风险等级对应数量饼状图
export function vulLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/vul/securityLevelPie',
    method: 'get',
    params: data
  })
}

//  获取ide下应用包统计图
export function appLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/package/securityLevelPie',
    method: 'get',
    params: data
  })
}

// 下载ide插件
export function downloadIde (data) {
  return fetch({
    url: `/oss/api-v1/open/ide/plugin/download/${data.type}`,
    method: 'get',
    responseType: 'blob',
    params: {
      loading: data.loading
    }
  })
}

// 获取项目token
export function getToken (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/token',
    method: 'get',
    params: data
  })
}

// 获取idea插件详情
export function taskDetail (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/detail',
    method: 'get',
    params: data
  })
}

// 导出idea插件
export function exportIde (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/export',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

//  获取ide下组件资产列表
export function taskComponentList (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/component/list',
    method: 'get',
    params: data
  })
}

// 分页获取任务下漏洞列表
export function taskVulList (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/vul/list',
    method: 'get',
    params: data
  })
}

//  批量更改组件资产状态（标记为）
export function taskChangeStatus (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/component/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 分页获取ide下许可证列表
export function licenseList (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/license/list',
    method: 'get',
    params: data
  })
}

// 获取许可证路径列表IDE
export function getLicenseUrlList (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/license/pathList',
    method: 'get',
    params: data
  })
}

// 获取依赖关系图
export function dependTreeChart (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/component/tree',
    method: 'get',
    params: data
  })
}

// 获取ide审查任务组件最大依赖层级
export function getIdeMaxDependency (data) {
  return fetch({
    url: '/oss/api-v1/open/ide/plugin/component/maxDependency',
    method: 'get',
    params: data
  })
}
