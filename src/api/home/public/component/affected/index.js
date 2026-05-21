import fetch from '@/utils/fetch'

// 分页获取组件受影响的项目列表
export function affectedProjectList (data) {
  return fetch({
    url: '/oss/api-v1/dic/component/affectedProject/list',
    method: 'get',
    params: data
  })
}

// 分页获取组件受影响的项目列表 - 漏洞风险管理
export function VulAffectedProjectList (data) {
  return fetch({
    url: '/oss/api-v1/dic/vul/affectedProject/list',
    method: 'get',
    params: data
  })
}
 // /api-v1/dic/codeTraceability/affectedProject/list
// 获取受影响的应用列表 - 资产分析与管理 -组件
export function affectedApplication (data) {
  return fetch({
    url: '/oss/api-v1/dic/component/affectedApplication/list',
    method: 'get',
    params: data
  })
}

// 获取受影响的应用列表 - 资产分析与管理 -漏洞
export function vulAffectedApplication (data) {
  return fetch({
    url: '/oss/api-v1/dic/vul/affectedApplication/list',
    method: 'get',
    params: data
  })
}


// 分页获取组件受影响的应用包列表
export function affectedAppList (data) {
  return fetch({
    url: '/oss/api-v1/dic/component/affectedAppPackageList',
    method: 'get',
    params: data
  })
}

// 获取受影响仓库
export function affectedRepositoryList (data) {
  return fetch({
    url: '/oss/api-v1/dic/component/affectedRepositoryList',
    method: 'get',
    params: data
  })
}

// 获取组件受影响总数
export function affectedCount (data) {
  return fetch({
    url: `/oss/api-v1/dic/component/affectedCount/${data.dicComponentId}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}
// 分页获取组件受影响的节点列表
export function affectedNodeList (data) {
  return fetch({
    url: '/oss/api-v1/dic/component/affectedNodeList',
    method: 'get',
    params: data
  })
}
