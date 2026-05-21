import fetch from '@/utils/fetch'

// svn列表
export function getSvnList (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/list',
    method: 'get',
    params: data
  })
}

// 物理删除svn
export function deleteBatch (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/deleteBatch',
    method: 'post',
    data: data
  })
}

// 审查代码仓库
export function detect (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/detectBatch',
    method: 'post',
    data: data
  })
}

// 添加svn
export function add (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/add',
    method: 'post',
    data: data
  })
}

// 获取svn审查包历史记录下拉列表
export function checkHistory (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/checkHistory/select',
    method: 'get',
    params: data
  })
}

// 获取svn查包详情
export function repositoryPackageDetail (data) {
  return fetch({
    url: `/oss/api-v1/asset/svnRepositoryPackage/detail/${data.id}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 获取组件列表
export function componentList (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/component/list',
    method: 'get',
    params: data
  })
}

// 分页获取许可证资产列表
export function licenseList (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/license/list',
    method: 'get',
    params: data
  })
}

// 获取许可证路径列表
export function getLicenseUrlList (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/license/pathList',
    method: 'get',
    params: data
  })
}

// 漏洞列表
export function vulList (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/vul/list',
    method: 'get',
    params: data
  })
}

// 导出仓库
export function exportFile (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/export',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 导出仓库
export function svnExportExcelBatch (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/exportExcelBatch',
    method: 'get',
    responseType: 'blob',
    params: data,
    noCancel: true
  })
}

export function excelConfirm (data) {
  return fetch({
    url: '/oss/api-v1/data/report/svn/excel/confirm',
    method: 'post',
    data: data
  })
}

export function svnExcelGenerate (data) {
  return fetch({
    url: '/oss/api-v1/data/report/svn/excel/generate',
    method: 'post',
    data: data
  })
}

// 导出仓库
export function exportDetail (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/detail/export',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 仓库统计饼状图
export function depositoryDataChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/securityLevelPie',
    method: 'get',
    params: data
  })
}

// 组件统计饼状图
export function componentDataChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/componentNumPie',
    method: 'get',
    params: data
  })
}

// 漏洞统计饼状图
export function bugDataChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/vulNumPie',
    method: 'get',
    params: data
  })
}

// 标记为
export function changeStatus (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/component/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 获取svn仓库审查任务组件最大依赖层级
export function getSvnMaxDependency (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/component/maxDependency',
    method: 'get',
    params: data
  })
}

// 下载svn代码库批量上传模板
export function svnDownloadTemplate (id, data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/downloadBatchCheckTemplate',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 分页查询svn代码库上传历史记录列表
export function uploadHistoryList (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/uploadHistory/list',
    method: 'get',
    params: data
  })
}

// svn代码库上传历史记录批量删除
export function svnUploadHistoryDel (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/uploadHistory/deleteBatch',
    method: 'post',
    data: data
  })
}

// 批量同步svn仓库代码
export function svnSyncCodeBatch (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/syncCodeBatch',
    method: 'post',
    data: data
  })
}

// svn测试是否连通
export function svnTestConnection (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/testConnection',
    method: 'post',
    data: data
  })
}

// 下载上传结果
export function svnDownloadResult (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/uploadHistory/downloadResult',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// svn仓库保存定时检测任务配置
export function saveScheduleTaskConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/saveScheduleTaskConfig',
    method: 'post',
    data: data
  })
}

// svn仓库批量保存定时检测任务配置
export function batchSvnSaveScheduleTaskConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/saveBatchScheduleTaskConfig',
    method: 'post',
    data: data
  })
}

// 编辑保存svn仓库信息
export function editSvnConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/save',
    method: 'post',
    data: data
  })
}

// 保存svn仓库信息前参数校验
export function validateSvnBeforeSave (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/validateBeforeSave',
    method: 'post',
    data: data,
    params: { loading: false }
  })
}

// 获取svn仓库定时任务配置
export function getScheduleTaskConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepository/getScheduleTaskConfig',
    method: 'get',
    params: data
  })
}

// 获取svn仓库审查任务组件树状图
export function svnRepositoryPackageComponentTree (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/component/tree',
    method: 'get',
    params: data
  })
}

// 获取svn仓库审查任务同源分析列表
export function svnRepositoryPackageSourceList (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/source/list',
    method: 'get',
    params: data
  })
}

// 获取svn仓库审查任务开源项目详细详情
export function svnRepositoryPackageSourceDetail (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/source/detail',
    method: 'get',
    params: data
  })
}

// svn仓库审查任务匹配文件列表
export function svnRepositoryPackageSourceMatchList (data) {
  return fetch({
    url: '/oss/api-v1/asset/svnRepositoryPackage/source/matchList',
    method: 'get',
    params: data
  })
}
