import fetch from '@/utils/fetch'

// 添加任务
export function addTask (data) {
  return fetch({
    url: '/oss/api-v1/task/package/add',
    method: 'post',
    data: data
  })
}

// 添加应用包审查任务-FTP
export function ftpAddTask (data) {
  return fetch({
    url: '/oss/api-v1/task/package/remote/ftp/add',
    method: 'post',
    data: data
  })
}

// 添加应用包审查任务-OBS
export function obsAddTask (data) {
  return fetch({
    url: '/oss/api-v1/task/package/remote/obs/add',
    method: 'post',
    data: data
  })
}

// 添加应用包审查任务-OSS
export function ossAddTask (data) {
  return fetch({
    url: '/oss/api-v1/task/package/remote/oss/add',
    method: 'post',
    data: data
  })
}

export function httpAddTask (data) {
  return fetch({
    url: '/oss/api-v1/task/package/remote/http/add',
    method: 'post',
    data: data
  })
}

// 校验应用包版本是否重复
export function checkVersion (data) {
  return fetch({
    url: '/oss/api-v1/asset/appPackage/exist/check',
    method: 'post',
    params: {
      loading: false,
      ...data
    }
  })
}

// 获取ftp列表
export function ftpList (data,signal) {
  return fetch({
    url: '/oss/api-v1/asset/remote/ftp/files',
    method: 'post',
    signal,
    data: {
      loading: false,
      ...data,
    }
  })
}

export function obsList (data, signal) {
  return fetch({
    url: '/oss/api-v1/asset/remote/obs/files',
    method: 'post',
    signal,
    data: {
      loading: false,
      ...data,
    }
  })
}

export function ossList (data, signal) {
  return fetch({
    url: '/oss/api-v1/asset/remote/oss/files',
    method: 'post',
    signal,
    data: {
      loading: false,
      ...data,
    }
  })
}
