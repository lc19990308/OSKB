import fetch from '@/utils/fetch'

// 获取vul列表
export function vulList (data) {
  return fetch({
    url: '/oss/api-v1/data/vul/list',
    method: 'get',
    params: data
  })
}

// 导出漏洞
export function exportVul (data) {
  return fetch({
    url: '/oss/api-v1/data/vul/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 导出
export function vulListExcel (data) {
  return fetch({
    url: '/oss/api-v1/data/report/vul/excel/generate',
    method: 'post',
    data: data
  })
}

// 受影响的项目
export function affectedProjectList (data) {
  return fetch({
    url: '/oss/api-v1/dic/vul/affectedProjectList',
    method: 'get',
    params: data
  })
}

// 获取漏洞风险等级对应数量饼状图
export function vulLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/data/vul/securityLevelPie',
    method: 'get',
    params: data
  })
}

// 获取漏洞类型及数量TOP10饼状图
export function vulTypeNumTop10Chart (data) {
  return fetch({
    url: '/oss/api-v1/data/vul/typePieTop10',
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

// 漏洞分享到jira平台
export function shareJira (data) {
  return fetch({
    url: '/oss/api-v1/data/vul/share/jira',
    method: 'post',
    params: data
  })
}
