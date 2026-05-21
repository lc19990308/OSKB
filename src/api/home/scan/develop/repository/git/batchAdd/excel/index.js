import fetch from '@/utils/fetch'

// 分页查询git代码库上传历史记录列表
export function uploadHistory (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/uploadHistory/list',
    method: 'get',
    params: data
  })
}

// 下载git代码库上传记录结果
export function downloadResult (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/uploadHistory/downloadResult',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// git代码库上传历史记录批量删除
export function deleteBatch (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/uploadHistory/deleteBatch',
    method: 'post',
    data: data
  })
}

// 下载git代码库批量上传模板
export function downloadBatchCheckTemplate (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/downloadBatchCheckTemplate',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}
