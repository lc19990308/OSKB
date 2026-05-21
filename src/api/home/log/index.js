import fetch from '@/utils/fetch'

// 获取列表
export function logList (data) {
  return fetch({
    url: '/oss/api-v1/system/log/list',
    method: 'get',
    params: data
  })
}

// 导出日志
export function exportFile (data) {
  return fetch({
    url: '/oss/api-v1/system/log/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 删除日志
export function delLog (data) {
  return fetch({
    url: '/oss/api-v1/system/log/deleteBatch',
    method: 'post',
    data: data
  })
}

// 操作top5
export function opTop5 (data) {
  return fetch({
    url: '/oss/api-v1/system/log/op/top5Bar',
    method: 'get',
    params: data
  })
}

// 用户top5
export function userTop5 (data) {
  return fetch({
    url: '/oss/api-v1/system/log/user/top5Bar',
    method: 'get',
    params: data
  })
}
