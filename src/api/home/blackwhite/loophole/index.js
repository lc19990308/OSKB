import fetch from '@/utils/fetch'

// 获取漏洞黑名单列表
export function vulnerabilityBlacklist (data) {
  return fetch({
    url: '/oss/api-v1/data/vulBlackWhitelist/list',
    method: 'get',
    params: data
  })
}

// 批量删除漏洞黑名单
export function deleteVulnerabilityBlacklist (data) {
  return fetch({
    url: '/oss/api-v1/data/vulBlackWhitelist/delete/batch',
    method: 'post',
    data: data
  })
}

// 导出
export function exportVulnerabilityBlacklist (data) {
  return fetch({
    url: '/oss/api-v1/data/vulBlackWhitelist/export/excel',
    method: 'get',
    responseType: 'blob',
    params: {
      ...data,
      loading: false
    }
  })
}

// 下载传模板
export function componentBaselineDownloadTemplate (data) {
  return fetch({
    url: '/oss/api-v1/data/vulBlackWhitelist/add/download/template',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 批量添加——获取上传记录列表
export function getAListOfUploadRecords (data) {
  return fetch({
    url: '/oss/api-v1/data/vulBlackWhitelist/add/list',
    method: 'get',
    params: data
  })
}

// 下载上传结果
export function downloadResult (id, data) {
  return fetch({
    url: `/oss/api-v1/data/vulBlackWhitelist/add/download/excel/${id}`,
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 批量添加——批量删除上传记录
export function componentBaselineDel (data) {
  return fetch({
    url: '/oss/api-v1/data/vulBlackWhitelist/add/delete/batch',
    method: 'post',
    data: data
  })
}

// 快速添加漏洞黑名单
export function VulAppendBatch (data) {
  return fetch({
    url: '/oss/api-v1/data/vulBlackWhitelist/add/batch',
    method: 'post',
    data: data
  })
}

// 快速添加——获取漏洞列表
export function getVulList (data) {
  return fetch({
    url: '/oss/api-v1/data/vulBlackWhitelist/vulnerability/list',
    method: 'get',
    params: data
  })
}
