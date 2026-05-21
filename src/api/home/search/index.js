import fetch from '@/utils/fetch'

// 组件列表
export function componentList (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/list',
    method: 'get',
    params: data
  })
}

// 漏洞列表
export function vulList (data) {
  return fetch({
    url: '/oss/api-v1/searcher/vul/list',
    method: 'get',
    params: data
  })
}

// 漏洞详情
export function vulDetail (data) {
  return fetch({
    url: `/oss/api-v1/searcher/vul/detail/${data.id}`,
    method: 'get',
    params: data
  })
}

// 漏洞详情
export function componentVulDetail (data) {
  return fetch({
    url: `/oss/api-v1/dic/vul/${data.id}`,
    method: 'get',
    params: data
  })
}

// 版本列表
export function versionList (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/versionList',
    method: 'get',
    params: data
  })
}

// 组件详情
export function componentDetail (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/detail',
    method: 'get',
    params: data
  })
}

// 组件详情图表
export function componentOverview (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/overview',
    method: 'get',
    params: data
  })
}

// 组件详情
export function componentVulList (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/vulList',
    method: 'get',
    params: data
  })
}

// 搜索历史记录
export function historyList (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/historyList',
    method: 'get',
    params: data
  })
}

// 推荐列表
export function recommendList (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/recommendList',
    method: 'get',
    params: data
  })
}

// 移除搜索记录
export function removeHistory (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/deleteHistory',
    method: 'post',
    data: data
  })
}

// 导出漏洞
export function exportBug (id, data) {
  return fetch({
    url: `/oss/api-v1/searcher/vul/excel/${id}`,
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 导出模板
export function batchDownloadTemplate (id, data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/batchSearch/downloadTemplate',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 组件批量查询历史记录结果批量下载
export function batchDownloadResult (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/batchSearch/history/downloadBatch',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 获取组件批量查询历史记录列表
export function riskScanHistoryList (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/batchSearch/history/list',
    method: 'get',
    params: data
  })
}

// 上传批量查询组件文件
export function batchSearchUpload (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/searcher/component/batchSearch/upload',
    method: 'post',
    data: data,
    params: {
      loading: false
    },
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config
  })
}

// 组件批量查询历史记录批量删除
export function historyDeleteBatch (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/batchSearch/history/deleteBatch',
    method: 'post',
    data: data
  })
}

// 导出单个组件的Excel表
export function exportExcel (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 生成word报告
export function createWordReport (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/exportWord',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 批量导出单个组件
export function exportWord (data) {
  return fetch({
    url: '/oss/api-v1/searcher/component/exportExcel/batch',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 获取组件、漏洞、许可总数
export function knowledgeStatistic (data) {
  return fetch({
    url: '/oss/api-v1/searcher/knowledge/statistic',
    method: 'get',
    params: data
  })
}

// 许可列表
export function licenseList (data) {
  return fetch({
    url: '/oss/api-v1/searcher/licenses',
    method: 'get',
    params: data
  })
}

// 许可证详情
export function licenseDetail (id) {
  return fetch({
    url: `/oss/api-v1/dic/license/detail/${id}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}
