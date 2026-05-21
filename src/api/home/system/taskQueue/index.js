import fetch from '@/utils/fetch'

// 获取系统设置-任务队列列表
export function getTaskList (data) {
  return fetch({
    url: '/oss/api-v1/system/task/list',
    method: 'get',
    params: data
  })
}

// 开始任务
export function startTask (data) {
  return fetch({
    url: '/oss/api-v1/system/task/resume',
    method: 'post',
    data: data
  })
}

// 暂停任务
export function pauseTask (data) {
  return fetch({
    url: '/oss/api-v1/system/task/pause',
    method: 'post',
    data: data
  })
}

// 删除任务
export function deleteTask (data) {
  return fetch({
    url: '/oss/api-v1/system/task/delete',
    method: 'post',
    data: data
  })
}

// 置顶任务
export function toppingTask (data) {
  return fetch({
    url: '/oss/api-v1/system/task/topping',
    method: 'post',
    data: data
  })
}

// 取消置顶任务
export function cancelToppingTask (data) {
  return fetch({
    url: '/oss/api-v1/system/task/cancel-topping',
    post: 'get',
    data: data
  })
}
