import fetch from '@/utils/fetch'

// 逻辑删除仓库
export function logicDelete (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/deleteBatch',
    method: 'post',
    data: data
  })
}

// 获取分支列表
export function getBranch (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/branch/select',
    method: 'post',
    data: data
  })
}

// 获取项目下代码仓库组件安全等级分类饼状图
export function componentLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/component/securityLevelBar',
    method: 'get',
    params: data
  })
}

// 仓库类型饼图
export function typeChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/typePie',
    method: 'get',
    params: data
  })
}

// 获取项目下代码仓库漏洞安全等级分类饼状图
export function vulLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/vul/securityLevelBar',
    method: 'get',
    params: data
  })
}

// 审查代码仓库
export function detect (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/detectBatch',
    method: 'post',
    data: data
  })
}

// 代码仓库列表
export function repositoryList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/list',
    method: 'get',
    params: data
  })
}

// 获取代码库审查包历史记录下拉列表
export function checkHistory (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/checkHistory/select',
    method: 'get',
    params: data
  })
}

// 分支下拉列表
export function checkBranchSelect (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/checkBranch/select',
    method: 'get',
    params: data
  })
}

// 获取代码库审查包详情
export function repositoryPackageDetail (data) {
  return fetch({
    url: `/oss/api-v1/asset/gitRepositoryPackage/detail/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 导出仓库
export function exportRepository (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/export',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 添加仓库
export function repositoryAdd (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/add',
    method: 'post',
    data: data
  })
}

// 漏洞列表
export function vulList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/vul/list',
    method: 'get',
    params: data
  })
}

// 分页获取许可证资产列表 源码管理
export function licenseListCode (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/license/list',
    method: 'get',
    params: data
  })
}

// 获取许可证路径列表 源码管理
export function getLicenseUrlListCode (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/license/pathList',
    method: 'get',
    params: data
  })
}

// 详情页导出仓库数据
export function exportRepositoryDetail (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/detail/export',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 获取组件列表
export function componentList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/component/list',
    method: 'get',
    params: data
  })
}

// 标记为
export function changeStatus (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/component/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 获取git配置
export function getGitConf (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/config',
    method: 'get',
    params: data
  })
}

// 清除git配置
export function clearGitConf (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/clearConfig',
    method: 'post',
    data: data
  })
}

// 保存git配置
export function saveConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/saveConfig',
    method: 'post',
    data: data
  })
}

// 测试git配置
export function testConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/testConnection',
    method: 'post',
    data: data
  })
}

// 获取仓库列表
export function gitRepositoryList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/search',
    method: 'get',
    params: data
  })
}

// 获取仓库列表
export function getGitRepositoryList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/list',
    method: 'get',
    params: data
  })
}

// 批量检测git仓库
export function gitRepositoryDetectBatch (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/detectBatch',
    method: 'post',
    data: data
  })
}

// 获取git仓库审查任务组件树状图
export function gitRepositoryPackageComponentTree (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/component/tree',
    method: 'get',
    params: data
  })
}

// 获取git仓库审查任务开源项目详细详情
export function gitRepositoryPackageSourceDetail (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/source/detail',
    method: 'get',
    params: data
  })
}

// 获取git仓库审查任务同源分析列表
export function gitRepositoryPackageSourceList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/source/list',
    method: 'get',
    params: data
  })
}

// git仓库审查任务匹配文件列表
export function gitRepositoryPackageSourceMatchList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/source/matchList',
    method: 'get',
    params: data
  })
}

// 重审，批量重审
export function gitRepositoryReDetectBatch (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/reDetectBatch',
    method: 'post',
    data: data
  })
}

// 获取git仓库审查任务组件最大依赖层级
export function getGitMaxDependency (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepositoryPackage/component/maxDependency',
    method: 'get',
    params: data
  })
}

// 保存定时任务
export function saveScheduleTaskConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/saveScheduleTaskConfig',
    method: 'post',
    data: data
  })
}

// 批量保存定时任务
export function batchSaveScheduleTaskConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/saveBatchScheduleTaskConfig',
    method: 'post',
    data: data
  })
}

// 编辑保存git仓库信息
export function editGitConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/save',
    method: 'post',
    data: data
  })
}

// 保存git仓库信息前参数校验
export function validateBeforeSave (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/validateBeforeSave',
    method: 'post',
    data: data,
    params: { loading: false }
  })
}

// 获取定时任务信息
export function getScheduleTaskConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/getScheduleTaskConfig',
    method: 'get',
    params: data
  })
}

// 用户确定导出git之前的确认信息
export function excelConfirm (data) {
  return fetch({
    url: '/oss/api-v1/data/report/git/excel/confirm',
    method: 'post',
    data: data
  })
}

// 生成git任务excel报告
export function excelGenerate (data) {
  return fetch({
    url: '/oss/api-v1/data/report/git/excel/generate',
    method: 'post',
    data: data
  })
}

// 获取webhook配置
export function geWebhookConfig (id) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/webhook/repository/' + id,
    method: 'get',
    params: { loading: false }
  })
}

// 开启关闭webhook
export function switchWebhook (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/webhook',
    method: 'post',
    data: { ...data, loading: false }
  })
}

// ssh公钥
export function geSshPublic (id) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/globalPublicKey',
    method: 'get',
    params: { loading: false }
  })
}

// 获取应用包审查任务知识图谱概览
export function knowledgeGraphOverviewApi (taskId) {
  return fetch({
    url: `/oss/api-v1/asset/gitRepositoryPackage/${taskId}/knowledge-graph/overview`,
    method: 'get'
  })
}

// 获取应用包审查任务知识图谱应用节点信息
export function knowledgeGraphApplicationApi (taskId) {
  return fetch({
    url: `/oss/api-v1/asset/gitRepositoryPackage/${taskId}/knowledge-graph/application`,
    method: 'get'
  })
}

// 获取应用包审查任务知识图谱组件节点信息
export function knowledgeGraphComponentApi (taskId, dicComponentId) {
  return fetch({
    url: `/oss/api-v1/asset/gitRepositoryPackage/${taskId}/knowledge-graph/component/${dicComponentId}`,
    method: 'get'
  })
}
