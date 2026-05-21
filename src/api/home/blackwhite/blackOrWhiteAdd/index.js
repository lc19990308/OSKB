import fetch from '@/utils/fetch'

// 获取组件黑白名单添加列表
export function addList (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBlackWhitelist/add/list',
    method: 'get',
    params: data
  })
}

// 删除组件黑白名单添加列表
export function delList (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBlackWhitelist/add/delete/batch',
    method: 'post',
    data: data
  })
}

// 下载上传结果
export function downloadResult (id, data) {
  return fetch({
    url: `/oss/api-v1/data/componentBlackWhitelist/add/download/excel/${id}`,
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 下载传模板
export function componentBaselineDownloadTemplate (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBlackWhitelist/add/download/template',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
