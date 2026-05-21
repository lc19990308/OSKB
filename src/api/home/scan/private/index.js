import fetch from '@/utils/fetch'

// 应用包删除
export function appDel (data) {
  return fetch({
    url: `/oss/api-v1/asset/package/delete/${data.id}`,
    method: 'post',
    data: {}
  })
}

//  批量删除私服库
export function delLibrary (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/deleteBatch',
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

// 同步私服库
export function syncLibrary (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/syncBatch',
    method: 'post',
    data: data
  })
}

//  批量扫描包
export function scanLibrary (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/scanBatch',
    method: 'post',
    data: data
  })
}

//  获取私服库下拉
export function getBinaryUrlSelect (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/name/select',
    method: 'post',
    data,
    params: {
      loading: false
    }
  })
}

//  获取项目下拉
export function getProjectSelect (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/project/select',
    method: 'post',
    data,
    params: {
      loading: false
    }
  })
}

// 添加私服库
export function addBinary (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/add',
    method: 'post',
    data: data
  })
}

// 批量定时任务
export function batchSaveScheduleTaskConfig (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/schedule',
    method: 'put',
    data: data
  })
}

// 获取私服库组件库目录
export function directoryTree (data) {
  return fetch({
    url: `/oss/api-v1/open/nexus/repository/directoryTree/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

//  私服库组件列表
export function componentList (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/component/list',
    method: 'get',
    params: data
  })
}

//  批量更改组件资产状态（标记为）
export function taskChangeStatus (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/component/changeStatusBatch',
    method: 'post',
    data: data
  })
}

//  获取私服库列表
export function libraryList (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/list',
    method: 'get',
    params: data
  })
}

// 私服库详情
export function libraryDetail (data) {
  return fetch({
    url: `/oss/api-v1/open/nexus/repository/${data.id}/tasks/${data.taskId}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}
// 获取历史检测记录
export function getHistoryTasks (id) {
  return fetch({
    url: `/oss/api-v1/open/nexus/repository/${id}/tasks`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

export function getNexusRepository (data) {
  return fetch({
    url: `/oss/api-v1/open/nexus/repository/${data.id}/tasks/${data.taskId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 获取应用包下漏洞风险等级对应数量饼状图
export function vulLevelNumChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/vul/securityLevelNumChart',
    method: 'get',
    params: data
  })
}

// 私服库漏洞列表
export function vulList (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/vul/list',
    method: 'get',
    params: data
  })
}

// 私服库组件风险等级
export function componentLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/component/securityLevelNumPie',
    method: 'get',
    params: data
  })
}

// 获取nexus私服库漏洞风险等级饼状图
export function taskVulLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/vul/securityLevelNumPie',
    method: 'get',
    params: data
  })
}

// 分页获取nexus仓库任务许可证列表
export function licenseList (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/license/list',
    method: 'get',
    params: data
  })
}

// 获取许可证路径列表 私服
export function getLicenseUrlList (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/license/pathList',
    method: 'get',
    params: data
  })
}

// 获取nexus审查任务组件最大依赖层级
export function getNexusMaxDependency (data) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/component/maxDependency',
    method: 'get',
    params: data
  })
}

// 获取类型
export function getRepositoryType (data = {}) {
  return fetch({
    url: '/oss/api-v1/open/nexus/repository/types',
    method: 'get',
    params: {
      ...data,
      loading: false
    }
  })
}

// 导出报告
export function exportReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/nexus/generate',
    method: 'post',
    data: data
  })
}
