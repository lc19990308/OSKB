import fetch from '@/utils/fetch'

// 导出
export function vulListExcel (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/data/report/vul/excel/generate',
    method: 'post',
    data: data,
    headers: { token }
  })
}

// 获取单个漏洞详情
export function getVulDetail (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/data/vul/detail',
    method: 'get',
    params: data,
    headers: { token }
  })
}

// 分页获取组件风险管理列表
export function riskComponentList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/asset/component/management/list',
    method: 'get',
    params: data,
    headers: { token }
  })
}

// 分页获取依赖路径统计列表
export function componentDependencyList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/asset/component/management/dependency/list',
    method: 'get',
    params: data,
    data: { loading: false },
    headers: { token }
  })
}

// 获取受影响的应用列表 - 资产分析与管理 -漏洞
export function vulAffectedApplication (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/dic/vul/affectedApplication/list',
    method: 'get',
    params: data,
    headers: { token }
  })
}

// 组件详情中的 - 分页获取依赖路径统计列表
export function dependencyList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/task/dependency/list',
    method: 'get',
    params: data,
    headers: { token }
  })
}

// 分页获取组件受影响的项目列表 - 漏洞风险管理
export function VulAffectedProjectList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/dic/vul/affectedProject/list',
    method: 'get',
    params: data,
    headers: { token }
  })
}

// 获取当前用户可见项目的负责人
export function allUserList (data, token) {
  return fetch({
    noCancel: true,
    url: '/oss/api-v1/open-api/asset/project/principal/all',
    method: 'get',
    data: { loading: false },
    headers: { token }
  })
}

// 获取语言列表
export function getLanguageList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/asset/component/management/language/all',
    method: 'get',
    params: { loading: false },
    headers: { token }
  })
}

// 项目列表
export function projectList (data, token) {
  return fetch({
    noCancel: true,
    url: '/oss/api-v1/open-api/asset/project/select',
    method: 'get',
    params: {
      loading: false,
      ...data
    },
    headers: { token }
  })
}
