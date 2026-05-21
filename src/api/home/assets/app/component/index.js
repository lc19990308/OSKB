import fetch from '@/utils/fetch'

// 应用包上传
export function appUpload (data, config) {
  let request = {
    url: '/oss/api-v1/asset/package/add',
    method: 'post',
    noCancel: true,
    data: data,
    params: {
      loading: false
    }
  }
  if (config) {
    request = Object.assign(request, config)
  }
  return fetch(request)
}

// 分片上传
export function chunkUpload (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/asset/package/addSlice',
    method: 'post',
    noCancel: true,
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

// 上传之前判断是否已经穿过了
export function beforeFileUpload (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/addSlice',
    method: 'get',
    noCancel: true,
    params: {
      loading: false,
      ...data
    }
  })
}

// 合并分片
export function mergeSimpleUpload (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/mergeSlice',
    noCancel: true,
    method: 'post',
    data
  })
}

// 应用包列表
export function appList (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/list',
    method: 'get',
    params: data
  })
}

// 应用包删除
export function appDel (data) {
  return fetch({
    url: `/oss/api-v1/asset/package/delete/${data.id}`,
    method: 'post',
    data: {}
  })
}

// 导出应用包
export function exportApp (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

//  获取应用包风险等级对应数量饼状图
export function appLevelNumChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/securityLevelNumChart',
    method: 'get',
    params: data
  })
}

// 获取应用包下组件风险等级对应数量饼状图
export function componentLevelNumChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/component/securityLevelNumChart',
    method: 'get',
    params: data
  })
}

// 获取应用包下漏洞风险等级对应数量饼状图
export function vulLevelNumChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/vul/securityLevelNumChart',
    method: 'get',
    params: data
  })
}

// 分页获取应用包管理下漏洞列表
export function assetVulList (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/vul/list',
    method: 'get',
    params: data
  })
}

// 标记为
export function changeStatus (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/component/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 应用包组件列表
export function appComponentList (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/component/list',
    method: 'get',
    params: data
  })
}

// 应用详情
export function appDetail (data) {
  return fetch({
    url: `/oss/api-v1/asset/package/detail/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 分页获取应用包下许可证资产列表
export function licenseList (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/license/list',
    method: 'get',
    params: data
  })
}

// 获取应用包下许可证路径列表
export function getLicenseUrlList (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/license/pathList',
    method: 'get',
    params: data
  })
}

// 获取应用包审查任务同源分析列表
export function sourceList (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/source/list',
    method: 'get',
    params: data
  })
}

// 获取应用包审查任务同源分析详情
export function sourceDetail (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/source/detail',
    method: 'get',
    params: data
  })
}

// 应用包审查任务匹配文件列表
export function sourceMatchFileList (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/source/matchList',
    method: 'get',
    params: data
  })
}

// 获取应用包管理详情下组件和漏洞计数信息
export function componentVulCount (data) {
  return fetch({
    url: `/oss/api-v1/asset/package/count/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 应用包审查任务依赖关系图
export function dependTreeChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/component/tree',
    method: 'get',
    params: data
  })
}

// 取应用包审查任务组件最大依赖层级
export function getAssetMaxDependency (data) {
  return fetch({
    url: '/oss/api-v1/asset/package/component/maxDependency',
    method: 'get',
    params: data
  })
}
