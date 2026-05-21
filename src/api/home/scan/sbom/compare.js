//  镜像安全扫描 - 对比SBOM
import fetch from '@/utils/fetch'

export function getComponentCompare (params) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/compare/component/list',
    method: 'get',
    params: params
  })
}

export function getLicenseCompare (params) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/compare/license/list',
    method: 'get',
    params: params
  })
}

export function getVulCompare (params) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/compare/vul/list',
    method: 'get',
    params: params
  })
}

export function getCompareCount (params) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/compare/count',
    method: 'get',
    params: params
  })
}
export function exportCompareSBOM (params, config = {}) {
  return fetch({
    url: '/oss/api-v1/asset/sbom/compare/export',
    method: 'get',
    params: params,
    responseType: 'blob',
    ...config
  })
}

export default {
  getComponentCompare,
  getLicenseCompare,
  getVulCompare,
  getCompareCount,
  exportCompareSBOM
}
