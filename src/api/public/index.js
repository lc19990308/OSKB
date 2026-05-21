import fetch from '@/utils/fetch'

export function getSiteInfo (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/getViewSetting',
    method: 'get',
    data: data,
  })
}

// 分片上传 二进制
export function binaryFileSlice (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/asset/binaryFile/upload/slice',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: {
      loading: false
    },
    data: data,
    ...config
  })
}

// 获取分片上传详情 二进制
export function binaryFileReceived (data) {
  return fetch({
    url: '/oss/api-v1/asset/binaryFile/upload/slice/received',
    method: 'get',
    params: {
      loading: false,
      ...data
    }
  })
}


// 分片上传 应用包
export function appPackageFileSlice (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/asset/appPackage/upload/slice',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: {
      loading: false
    },
    data: data,
    ...config
  })
}

// 获取分片上传详情 应用包
export function appPackageFileReceived (data) {
  return fetch({
    url: '/oss/api-v1/asset/appPackage/upload/slice/received',
    method: 'get',
    params: {
      loading: false,
      ...data
    }
  })
}

// 分片上传 容器镜像扫描
export function containerFileSlice (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/asset/container/upload/slice',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: {
      loading: false
    },
    data: data,
    ...config
  })
}

// 获取分片上传详情 容器镜像扫描
export function containerFileReceived (data) {
  return fetch({
    url: '/oss/api-v1/asset/container/upload/slice/received',
    method: 'get',
    params: {
      loading: false,
      ...data
    }
  })
}
