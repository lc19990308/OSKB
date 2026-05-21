import fetch from '@/utils/fetch'

// 获取组件版本基线列表
export function componentBaselineList (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/list',
    method: 'get',
    params: data
  })
}

// 批量删除组件版本基线
export function deleteComponentBaseline (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/delete/batch',
    method: 'post',
    data: data
  })
}

// 导出
export function exportComponentBaseline (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/export/excel',
    method: 'get',
    responseType: 'blob',
    params: {
      ...data,
      loading: false
    }
  })
}

// 下载传模板
export function componentBaselineDownloadTemplate (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/add/download/template',
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 批量添加——获取上传记录列表
export function getAListOfUploadRecords (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/add/list',
    method: 'get',
    params: data
  })
}

// 下载上传结果
export function downloadResult (id, data) {
  return fetch({
    url: `/oss/api-v1/data/componentBaseline/add/download/excel/${id}`,
    method: 'get',
    responseType: 'blob',
    params: data
  })
}

// 批量添加——批量删除上传记录
export function componentBaselineDel (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/add/delete/batch',
    method: 'post',
    data: data
  })
}

// 获取组件所有版本
export function versionList (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/version/all',
    method: 'get',
    params: {
      ...data,
      loading: false
    }
  })
}

// 更新组件版本基线
export function componentBaselineUpdate (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/update',
    method: 'post',
    data: data
  })
}

// 快速添加——获取组件列表
export function getComponentList (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/component/list',
    method: 'get',
    params: data
  })
}

// 快速添加组件版本基线
export function componentBaselineAppend (data) {
  return fetch({
    url: '/oss/api-v1/data/componentBaseline/add',
    method: 'post',
    data: data
  })
}
