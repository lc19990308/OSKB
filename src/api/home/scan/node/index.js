import fetch from '@/utils/fetch'

// 节点审查列表
export function nodeList (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/list',
    method: 'get',
    params: data
  })
}

// 删除节点
export function nodeDel (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/deleteBatch',
    method: 'post',
    data: data
  })
}

// 节点安装
export function nodeInstall (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/add',
    method: 'post',
    data: data
  })
}

// 更改节点启用状态
export function updateEnableStatus (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/updateEnableStatusBatch',
    method: 'post',
    data: data
  })
}

// 修改节点名称
export function updateName (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/updateName',
    method: 'post',
    data: data
  })
}

// 导出节点
export function exportNode (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 获取开发语言下拉列表
export function languageSelect (data) {
  return fetch({
    url: '/oss/api-v1/dic/language/select',
    method: 'get',
    data: data
  })
}

// 获取中间件下拉菜单(JAVA语言)
export function getMiddleware (data) {
  return fetch({
    url: '/oss/api-v1/iast/middleware/select',
    method: 'get',
    data: data
  })
}

// 获取节点下所有应用下拉列表
export function appSelect (data) {
  return fetch({
    url: '/oss/api-v1/iast/app/select',
    method: 'get',
    params: data
  })
}

// 获取节点下所有应用下拉列表
export function componentList (data) {
  return fetch({
    url: '/oss/api-v1/iast/app/component/list',
    method: 'get',
    params: data
  })
}

// 漏洞列表
export function vulList (data) {
  return fetch({
    url: '/oss/api-v1/iast/app/vul/list',
    method: 'get',
    params: data
  })
}

// 获取单个漏洞详情
export function getVulDetail (data) {
  return fetch({
    url: '/oss/api-v1/data/vul/detail',
    method: 'get',
    params: data
  })
}

// 标记为
export function changeStatus (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/component/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 获取项目下节点、组件、应用总数饼状图
export function nodeAppComponentChart (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/nodeAppComponentPie',
    method: 'get',
    params: data
  })
}

// 获取项目下组件按风险等级分类饼状图
export function componentLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/component/securityLevelPie',
    method: 'get',
    params: data
  })
}

// 获取项目下漏洞按风险等级分类饼状图
export function vulLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/iast/node/vul/securityLevelPie',
    method: 'get',
    params: data
  })
}

// 分页获取许可证资产列表
export function licenseList (data) {
  return fetch({
    url: '/oss/api-v1/iast/app/license/list',
    method: 'get',
    params: data
  })
}

// 获取许可证路径列表 节点
export function getLicenseUrlList (data) {
  return fetch({
    url: '/oss/api-v1/iast/app/license/pathList',
    method: 'get',
    params: data
  })
}

// 获取测试运行监控任务组件最大依赖层级
export function getAppMaxDependency (data) {
  return fetch({
    url: '/oss/api-v1/iast/app/component/maxDependency',
    method: 'get',
    params: data
  })
}
