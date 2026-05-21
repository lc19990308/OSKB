import fetch from '@/utils/fetch'

// 获取jenkins详情所需的参数
export function getJenkinsParams (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/jenkins/taskDetail/sign',
    method: 'get',
    headers: {
      OpenApiToken: token
    },
    params: data
  })
}

// 任务详情
export function taskDetail (data) {
  return fetch({
    url: `/oss/api-v1/open-api/jenkins/asset/detail/${data.taskId}`,
    method: 'get',
    headers: {
      OpenApiToken: data.token
    },
    params: {
      loading: data.loading
    }
  })
}

//  获取应用包审查任务下组件和漏洞计数信息
export function taskCount (data) {
  return fetch({
    url: `/oss/api-v1/open-api/jenkins/asset/count/${data.taskId}`,
    method: 'get',
    params: {
      loading: data.loading
    },
    headers: {
      OpenApiToken: data.token
    }
  })
}

//  获取应用包下漏洞风险等级对应数量饼状图
export function componentList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/jenkins/component/list',
    method: 'get',
    params: data,
    headers: {
      OpenApiToken: token
    }
  })
}

// 获取集成部署审查任务组件最大依赖层级
export function getIntegrationMaxDependency (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/jenkins/component/maxDependency',
    method: 'get',
    params: data,
    headers: {
      OpenApiToken: token
    }
  })
}

// 组件漏洞列表
export function componentVulList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/jenkins/component/vul/list',
    method: 'get',
    params: data,
    headers: {
      OpenApiToken: token
    }
  })
}

// 组件下的许可证列表
export function componentLicenseList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/jenkins/component/licenseList',
    method: 'get',
    params: data,
    headers: {
      OpenApiToken: token
    }
  })
}

// 组件资产详情
export function assetComponentDetail (data, token) {
  return fetch({
    url: `/oss/api-v1/open-api/jenkins/component/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    },
    headers: {
      OpenApiToken: token
    }
  })
}

// 分页获取应用包审查任务下漏洞列表
export function taskVulList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/jenkins/vul/list',
    method: 'get',
    params: data,
    headers: {
      OpenApiToken: token
    }
  })
}

// jenkins持续集成模块接口
export function licenseList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/jenkins/license/list',
    method: 'get',
    params: data,
    headers: {
      OpenApiToken: token
    }
  })
}

// 获取许可证路径列表 集成部署
export function getLicenseUrlList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/jenkins/license/pathList',
    method: 'get',
    params: data,
    headers: {
      OpenApiToken: token
    }
  })
}

// 获取详情
export function licenseDetail (data, token) {
  return fetch({
    url: `/oss/api-v1/open-api/jenkins/license/detail/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    },
    headers: {
      OpenApiToken: token
    }
  })
}

// 单组件依赖关系
export function dependencyPathApi (id, token, data) {
  return fetch({
    url: `/oss/api-v1/open-api/jenkins/dependencyPath/${id}`,
    method: 'get',
    params: data,
    headers: {
      OpenApiToken: token
    }
  })
}

// 获取项目质量门禁配置
export function getTaskQualityDetails (taskId, token) {
  return fetch({
    url: `/oss/api-v1/open-api/jenkins/task/quality/${taskId}`,
    method: 'get',
    params: {
      loading: false
    },
    headers: {
      OpenApiToken: token
    }
  })
}

// 获取组件所有版本
export function openVersionList (data, token) {
  return fetch({
    url: '/oss/api-v1/open-api/jenkins/componentBaseline/version/all',
    method: 'get',
    params: {
      ...data,
      loading: false
    },
    headers: {
      OpenApiToken: token
    }
  })
}
