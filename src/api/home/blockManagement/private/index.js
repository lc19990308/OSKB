import fetch from '@/utils/fetch'

// 获取阻断记录列表
export function getLogsApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/logs',
    method: 'get',
    params: data
  })
}

// 保存阻断记录标签
export function saveTagsApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/logs/tags',
    method: 'post',
    data: data
  })
}

// 更新阻断记录标签
export function putTagsApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/logs/tags',
    method: 'put',
    data: data
  })
}

// 删除阻断记录标签
export function delTagsApi (id, data) {
  return fetch({
    url: `/oss/api-v1/asset/or-agents/logs/tags/${id}`,
    method: 'delete',
    data: data
  })
}

// 删除记录
export function delLogs (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/logs',
    method: 'delete',
    data: data
  })
}

// 下载代理
export function downloadDetectPlugin () {
  return fetch({
    url: '/oss/api-v1/open/devops/download/detectPlugin/or_agents',
    method: 'get',
    responseType: 'blob'
  })
}

// 获取所有阻断记录标签值
export function getTagsApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/logs/tags/values',
    method: 'get',
    params: data
  })
}

// 获取节点列表
export function getNodeListApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents',
    method: 'get',
    params: data
  })
}

// 获取阻断规则
export function getRegularsApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/regulars',
    method: 'get',
    params: data
  })
}

// 保存阻断规则
export function postRegularsApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/regulars',
    method: 'post',
    data: data
  })
}

// 获取所有仓库类型
export function getRepositoryTypesApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/mappings/repositoryTypes',
    method: 'get',
    params: data
  })
}

// 获取所有仓库配置
export function getRepositoryConfApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/mappings',
    method: 'get',
    params: data
  })
}

// 保存仓库配置
export function postRepositoryConfApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/mappings',
    method: 'post',
    data: data
  })
}

// 修改仓库配置
export function editRepositoryConfApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/mappings',
    method: 'put',
    data: data
  })
}

// 删除仓库配置
export function delRepositoryConfApi (id, data) {
  return fetch({
    url: `/oss/api-v1/asset/or-agents/mappings/${id}`,
    method: 'delete',
    data: data
  })
}

// 获取许可证下拉框数据
export function getLicensesApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/regulars/licenses',
    method: 'get',
    params: data
  })
}

// 获取阻断记录保留天数
export function getLogsRetentionApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/logs/retention',
    method: 'get',
    params: data
  })
}

// 导出
export function getLogsExcel (data) {
  return fetch({
    url: '/oss/api-v1/asset/or-agents/logs/report/excel',
    method: 'post',
    data: data
  })
}

// 加入白名单
export function joinWhitelist (id, data) {
  return fetch({
    url: `/oss/api-v1/asset/or-agents/logs/${id}/whitelist`,
    method: 'post',
    data: data
  })
}

// 取消白名单
export function cancelWhitelist (id, data) {
  return fetch({
    url: `/oss/api-v1/asset/or-agents/logs/${id}/whitelist`,
    method: 'DELETE',
    data: data
  })
}
