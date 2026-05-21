import fetch from '@/utils/fetch'

//  批量审查应用包审查任务
export function detectTask (data) {
  return fetch({
    url: '/oss/api-v1/task/package/detectBatch',
    method: 'post',
    data: data
  })
}

//  导出应用包审查任务Excel
export function exportTask (data) {
  return fetch({
    url: '/oss/api-v1/task/package/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

//  任务列表
export function taskList (data) {
  return fetch({
    url: '/oss/api-v1/task/package/list',
    method: 'get',
    params: data
  })
}

//  批量删除应用包审查任务
export function delTask (data) {
  return fetch({
    url: '/oss/api-v1/asset/appPackage/deleteBatch',
    method: 'post',
    data: data
  })
}

// 获取应用包审查任务下组件风险等级对应数量饼状图
export function taskComponentLevelNumChart (data) {
  return fetch({
    url: '/oss/api-v1/task/package/component/securityLevelNumChart',
    method: 'get',
    params: data
  })
}

// 获取应用包审查任务下应用风险等级对应数量饼状图
export function taskAppLevelNumChart (data) {
  return fetch({
    url: '/oss/api-v1/task/package/securityLevelPie',
    method: 'get',
    params: data
  })
}

// 获取应用包审查任务下漏洞风险等级对应数量饼状图
export function taskVulLevelNumChart (data) {
  return fetch({
    url: '/oss/api-v1/task/package/vul/securityLevelNumChart',
    method: 'get',
    params: data
  })
}

// 校验应用包审查任务是否重复
export function checkPackageTaskDuplicate (data) {
  return fetch({
    url: '/oss/api-v1/task/package/checkPackageTaskDuplicate',
    method: 'post',
    data
  })
}

//  获取应用包下拉列表
export function appSelect (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/select',
    method: 'get',
    params: data
  })
}

//  获取应用包下组件资产列表
export function taskComponentList (data) {
  return fetch({
    url: '/oss/api-v1/task/package/component/list',
    method: 'get',
    params: data
  })
}

//  批量更改组件资产状态（标记为）
export function taskChangeStatus (data) {
  return fetch({
    url: '/oss/api-v1/task/package/component/changeStatusBatch',
    method: 'post',
    data: data
  })
}

//  获取应用包审查任务下组件和漏洞计数信息
export function taskCount (data) {
  return fetch({
    url: `/oss/api-v1/task/package/count/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 任务详情
export function taskDetail (data) {
  return fetch({
    url: `/oss/api-v1/task/package/detail/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 分页获取许可证资产列表 应用包
export function licenseList (data) {
  return fetch({
    url: '/oss/api-v1/task/package/license/list',
    method: 'get',
    params: data
  })
}

// 获取许可证路径列表 应用包
export function getLicenseUrlList (data) {
  return fetch({
    url: '/oss/api-v1/task/package/license/pathList',
    method: 'get',
    params: data
  })
}

// 分页获取应用包审查任务下漏洞列表
export function taskVulList (data) {
  return fetch({
    url: '/oss/api-v1/task/package/vul/list',
    method: 'get',
    params: data
  })
}

// 获取应用包审查任务同源分析列表
export function sourceList (data) {
  return fetch({
    url: '/oss/api-v1/task/package/source/list',
    method: 'get',
    params: data
  })
}

// 修改漏洞备注
export function editVulRemark (data) {
  return fetch({
    url: '/oss/api-v1/data/vul/customizeVulData',
    method: 'post',
    data
  })
}

// 获取应用包审查任务同源分析详情
export function sourceDetail (data) {
  return fetch({
    url: '/oss/api-v1/task/package/source/detail',
    method: 'get',
    params: data
  })
}

// 应用包审查任务匹配文件列表
export function sourceMatchFileList (data) {
  return fetch({
    url: '/oss/api-v1/task/package/source/matchList',
    method: 'get',
    params: data
  })
}

// 应用包审查任务依赖关系图
export function dependTreeChart (data) {
  return fetch({
    url: '/oss/api-v1/task/package/component/tree',
    method: 'get',
    params: data
  })
}

// 获取应用包审查任务组件最大依赖层级
export function getMaxDependency (data) {
  return fetch({
    url: '/oss/api-v1/task/package/component/maxDependency',
    method: 'get',
    params: data
  })
}

// 获取应用包审查任务知识图谱概览
export function knowledgeGraphOverviewApi (taskId) {
  return fetch({
    url: `/oss/api-v1/task/package/${taskId}/knowledge-graph/overview`,
    method: 'get'
  })
}

// 获取应用包审查任务知识图谱应用节点信息
export function knowledgeGraphApplicationApi (taskId) {
  return fetch({
    url: `/oss/api-v1/task/package/${taskId}/knowledge-graph/application`,
    method: 'get'
  })
}

// 获取应用包审查任务知识图谱组件节点信息
export function knowledgeGraphComponentApi (taskId, dicComponentId) {
  return fetch({
    url: `/oss/api-v1/task/package/${taskId}/knowledge-graph/component/${dicComponentId}`,
    method: 'get'
  })
}
