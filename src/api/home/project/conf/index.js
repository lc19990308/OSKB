import fetch from '@/utils/fetch'

// 项目列表
export function projectList (data) {
  return fetch({
    url: '/oss/api-v1/asset/project/list',
    method: 'get',
    params: data
  })
}

// 获取单个项目详情
export function projectInfo (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/project/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 风险统计
export function projectCount (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/project/${projectId}/count`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 集成部署
export function integrationCount (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/integration/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

export function integrationImageCount (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/integration/image/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 二进制检测
export function binaryAnalysisCount (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/binaryAnalysis/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 代码库管理
export function scmsCount (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/scms/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// svn
export function svnRepository (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/svnRepository/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

export function gitRepository (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/gitRepository/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

export function fireflyRepository (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/fireflyRepository/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 测试运行监控
export function iastNodeCount (projectId) {
  return fetch({
    url: `/oss/api-v1/iast/node/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// IDE开发管理
export function idePluginCount (projectId) {
  return fetch({
    url: `/oss/api-v1/open/ide/plugin/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 私服库安全扫描
export function nexusRepositoryCount (projectId) {
  return fetch({
    url: `/oss/api-v1/open/nexus/repository/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 组件依赖检测
export function assetPackageCount (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/package/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 应用列表
export function affectedApplication (data) {
  return fetch({
    url: '/oss/api-v1/asset/project/affectedApplication/list',
    method: 'get',
    params: data
  })
}

// 镜像
export function imageCount (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/image/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// sbom
export function sbomCount (projectId) {
  return fetch({
    url: `/oss/api-v1/asset/sbom/count/projects/${projectId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}
