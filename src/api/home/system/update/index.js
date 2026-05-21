import fetch from '@/utils/fetch'

// 获取当前版本号
export function currentVersion (data) {
  return fetch({
    url: '/oss/api-v1/system/upgrade/currentVersion',
    method: 'get',
    params: data
  })
}

// 获取最新一次知识库更新时间
export function lastTime (data) {
  return fetch({
    url: '/oss/api-v1/system/upgradeHistory/knowledge/last',
    method: 'get',
    params: data
  })
}

// 上传web更新包
export function uploadWeb (data, config) {
  let request = {
    url: '/oss/api-v1/system/upgrade/knowledgeDb',
    method: 'post',
    data: data,
    params: {
      loading: true
    }
  }
  if (config) {
    request = Object.assign(request, config)
  }
  return fetch(request)
}

// 获取更新进度
export function updateProgress (data) {
  return fetch({
    url: '/oss/api-v1/system/upgrade/web/process',
    method: 'get',
    params: data
  })
}

// 获取系统更新历史记录列表
export function historyList (data) {
  return fetch({
    url: '/oss/api-v1/system/upgradeHistory/list',
    method: 'get',
    params: data
  })
}
