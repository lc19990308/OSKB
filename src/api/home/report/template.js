import fetch from '@/utils/fetch'

// 获取模板列表
export function templateList (data) {
  return fetch({
    url: '/oss/api-v1/data/report/templates',
    method: 'get',
    params: data
  })
}

// 新增模板
export function addTemplate (data) {
  return fetch({
    url: '/oss/api-v1/data/report/templates',
    method: 'post',
    data
  })
}

// 批量删除模板
export function delTemplate (data) {
  return fetch({
    url: '/oss/api-v1/data/report/templates',
    method: 'delete',
    data
  })
}

// 模板详情
export function templateDetails (data) {
  return fetch({
    url: '/oss/api-v1/data/report/templates/' + data.templateId,
    method: 'get',
    data
  })
}

// 更新模板
export function updateTemplate (data) {
  return fetch({
    url: '/oss/api-v1/data/report/templates/' + data.templateId,
    method: 'put',
    data
  })
}

// 获取模板内容
export function defaultTemplateContent (data) {
  return fetch({
    url: '/oss/api-v1/data/report/templates/default/' + data.moduleCode,
    method: 'get',
    data
  })
}

// 获取所属模块
export function templateModules (data) {
  return fetch({
    url: '/oss/api-v1/data/report/templates/modules',
    method: 'get',
    data
  })
}
