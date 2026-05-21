//  镜像安全扫描 - 对比SBOM
import fetch from '@/utils/fetch'

// 镜像安全扫描-对比SBOM-查询组件比对列表结果
export function getComponentCompare (params) {
  return fetch({
    url: '/oss/api-v1/asset/package/compare/component/list',
    method: 'get',
    params: params
  })
}

// 镜像安全扫描-对比SBOM-查询许可证比对列表结果
export function getLicenseCompare (params) {
  return fetch({
    url: '/oss/api-v1/asset/package/compare/license/list',
    method: 'get',
    params: params
  })
}

// 镜像安全扫描-对比SBOM-查询漏洞比对列表结果
export function getVulCompare (params) {
  return fetch({
    url: '/oss/api-v1/asset/package/compare/vul/list',
    method: 'get',
    params: params
  })
}

// 镜像安全扫描-对比SBOM-对比结果总数
export function getCompareCount (params) {
  return fetch({
    url: '/oss/api-v1/asset/package/compare/count',
    method: 'get',
    params: params
  })
}
//  镜像安全扫描-对比SBOM-SBOM对比导出
export function exportCompareSBOM (params, config = {}) {
  return fetch({
    url: '/oss/api-v1/asset/package/compare/export',
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
