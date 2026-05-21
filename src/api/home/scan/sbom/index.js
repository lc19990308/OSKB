import fetch from '@/utils/fetch'

// 分片上传
export function sbomPackageFileSlice (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/upload/slice',
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

// 获取分片上传详情
export function sbomPackageFileReceived (data) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/upload/slice/received',
    method: 'get',
    params: {
      loading: false,
      ...data
    }
  })
}

// 添加任务
export function addTask (data) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/add',
    method: 'post',
    data: data
  })
}

// 校验应用包版本是否重复
export function checkVersion (data) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/exist/check',
    method: 'post',
    params: {
      loading: false,
      ...data
    }
  })
}

// 编辑保存sbom信息
export function updateSbom (data) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/save',
    method: 'post',
    data: data
  })
}

// 报告导出
export function createExcelReport (data) {
  return fetch({
    url: '/oss/api-v1/data/report/sbomPackage/excel/generate',
    method: 'post',
    data: data
  })
}

// 应用包列表
export function appList (data) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/list',
    method: 'get',
    params: data
  })
}

// 应用包删除
export function deleteBatch (data) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/deleteBatch',
    method: 'post',
    data: data
  })
}

// 下载传模板
export function downloadTemplateExcel (data) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/template/download/excel',
    method: 'get',
    responseType: 'blob',
    params: data
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

export function taskDetail (data) {
  return fetch({
    url: `/oss/api-v1/asset/sbom/detail/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 组件最大依赖层级
export function getSbomMaxDependency (data) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/component/maxDependency',
    method: 'get',
    params: data
  })
}
