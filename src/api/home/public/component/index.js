import fetch from '@/utils/fetch'

// 组件下的许可证列表
export function componentLicenseList (data) {
  return fetch({
    url: '/oss/api-v1/dic/component/licenseList',
    method: 'get',
    params: data
  })
}

// 组件资产详情
export function assetComponentDetail (data) {
  return fetch({
    url: `/oss/api-v1/asset/component/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 自定义组件信息
export function customizeComponentData (data) {
  return fetch({
    url: '/oss/api-v1/asset/component/customizeComponentData',
    method: 'post',
    data
  })
}

// 组件详情
export function componentDetail (data) {
  return fetch({
    url: '/oss/api-v1/dic/component/detail',
    method: 'get',
    params: data
  })
}

// 获取组件详情
export function componentManagementDetail (dicComponentId) {
  return fetch({
    url: `/oss/api-v1/asset/component/management/detail/${dicComponentId}`,
    method: 'get'
  })
}

// 获取组件详情
export function componentManagementDetailByPdceiid (pdceiid) {
  return fetch({
    url: `/oss/api-v1/asset/component/management/detail/pdcei/${pdceiid}`,
    method: 'get'
  })
}

// 单组件依赖关系
export function dependencyPathApi (id,data) {
  return fetch({
    url: `/oss/api-v1/asset/component/dependencyPath/${id}`,
    method: 'get',
    params: data
  })
}

// 获取分析组件的漏洞详情
export function analyzeVulApi (data) {
  return fetch({
    url: `/oss/api-v1/asset/component/analyze/vul`,
    method: 'get',
    params: data
  })
}

// 分析组件并获取结果
export function analyzeApi (data, signal) {
  return fetch({
    signal,
    url: `/oss/api-v1/asset/component/analyze`,
    method: 'post',
    data: data
  })
}

// 获取应用维度
export function getComponentManagementPackage (data) {
  return fetch({
    url: `/oss/api-v1/asset/component/management/detail/package`,
    method: 'post',
    data: data
  })
}

