import fetch from '@/utils/fetch'

// 获取语言列表
export function getLanguageList (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/languages',
    method: 'get',
    params: data
  })
}

export function getSourceCheckByIdApi (id) {
  return fetch({
    url: `/oss/api-v1/asset/sourceCheck/${id}`,
    method: 'get'
  })
}

export function putSourceCheckByIdApi (data, id) {
  return fetch({
    url: `/oss/api-v1/asset/sourceCheck/${id}`,
    method: 'put',
    data
  })
}

// 查询版本是否重复
export function checkRepeat (data) {
  return fetch({
    url: '/oss-saas/api-v1/application/checkRepeat',
    method: 'post',
    data: { ...data, loading: false }
  })
}

// 检测语言和匹配的文件数量 视图对象 项目文件标记状态和匹配的文件数量 视图对象
export function getFileNums (taskId) {
  return fetch({
    url: `/oss/api-v1/asset/sourceCheck/result/getFileNums/${taskId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}
// 获取解压后的源文件目录结构
export function getDirectory (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/directory/structure',
    method: 'post',
    data: data
  })
}

//  批量删除应用
export function delTask (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/batch',
    method: 'delete',
    data: data
  })
}

// 批量检测
export function batchTesting (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/detect/batch',
    method: 'post',
    data: data
  })
}

//  取消检测
export function cancelTask (id) {
  return fetch({
    url: `/oss/api-v1/asset/sourceCheck/cancel/${id}`,
    method: 'post'
  })
}

// 分片上传 应用包
export function appPackageFileSlice (data, config = {}) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/upload/slice',
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

// 添加任务、审查
export function addTask (data) {
  return fetch({
    url: `/oss/api-v1/asset/sourceCheck/detect/${data.id}`,
    method: 'post',
    data: {
      loading: data.loading
    }
  })
}

// 任务详情
export function getDetailsByTaskId (taskId) {
  return fetch({
    url: `/oss/api-v1/asset/sourceCheck/result/codeMatchDetails/code/${taskId}`,
    method: 'get'
  })
}

// 检测
export function batchTest (data) {
  return fetch({
    url: '/oss-saas/api-v1/task/batchAdd',
    method: 'post',
    data: data
  })
}

// 获取分片上传详情 应用包
export function appPackageFileReceived (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/upload/slice/received',
    method: 'post',
    data: {
      loading: false,
      ...data
    }
  })
}

// 应用包列表
export function appList (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/list',
    method: 'post',
    data
  })
}

// 查询文件目录 右边列表详情
export function getResultInfo (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/getProjectInfo',
    method: 'get',
    params: data
  })
}

// 查询匹配项目下文件结果
export function getMatchResult (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/matchInformation/list',
    method: 'get',
    params: data
  })
}

// 获取所有项目名称+地址的分页
export function getAllProject (data = {}) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/matchInformation/sign/project',
    method: 'get',
    params: {
      loading: false,
      ...data
    }
  })
}

// 获取所有开源项目版本
export function getVersionList (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/matchInformation/sign/version',
    method: 'get',
    params: data
  })
}

// 根据开源项目版本id，获取license列表
export function getOpenLicense (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/matchInformation/sign/license',
    method: 'get',
    params: data
  })
}

// 根据匹配文件id获取源文件代码
export function getCodeApi (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/codeMatchDetails/code',
    method: 'post',
    data
  })
}

// 报告
export function socGenerateExcel (data) {
  return fetch({
    url: '/oss/api-v1/data/report/soc/excel/generate',
    method: 'post',
    data
  })
}

// 批量更新文件的标记状态与开源详情
export function updateSign (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/matchInformation/sign/batch',
    method: 'post',
    data: data
  })
}

// 查询源文件标记详情对象
export function getSignDetail (data) {
  return fetch({
    url: '/oss-saas/api-v1/homology/result/file/sign/detail',
    method: 'get',
    params: data
  })
}

// 查询匹配项目统计
export function getStatistics (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/matchInformation/sign/statistics',
    method: 'get',
    params: data
  })
}

// 统计概览主页
export function getOverview (taskId) {
  return fetch({
    url: `/oss/api-v1/asset/sourceCheck/overview/main/${taskId}`,
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 标记为
export function changeStatus (data) {
  return fetch({
    url: '/oss-saas/api-v1/asset/package/component/changeStatusBatch',
    method: 'post',
    data: data
  })
}

// 应用包组件列表
export function appComponentList (data) {
  return fetch({
    url: '/oss-saas/api-v1/asset/package/component/list',
    method: 'get',
    params: data
  })
}

// 分页获取应用包下许可证资产列表
export function licenseList (data) {
  return fetch({
    url: '/oss-saas/api-v1/asset/package/license/list',
    method: 'get',
    params: data
  })
}

// 获取应用包下许可证路径列表
export function getLicenseUrlList (data) {
  return fetch({
    url: '/oss-saas/api-v1/asset/package/license/pathList',
    method: 'get',
    params: data
  })
}

// 获取应用包审查任务同源分析列表
export function sourceList (data) {
  return fetch({
    url: '/oss-saas/api-v1/asset/package/source/list',
    method: 'get',
    params: data
  })
}

// 分页查询同源开源项目结果
export function getHomologyList (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/list',
    method: 'post',
    data: data
  })
}

// 获取应用包审查任务同源分析详情
export function sourceDetail (data) {
  return fetch({
    url: '/oss-saas/api-v1/asset/package/source/detail',
    method: 'get',
    params: data
  })
}

// 应用包审查任务匹配文件列表
export function sourceMatchFileList (data) {
  return fetch({
    url: '/oss-saas/api-v1/asset/package/source/matchList',
    method: 'get',
    params: data
  })
}

// 获取应用包管理详情下组件和漏洞计数信息
export function componentVulCount (data) {
  return fetch({
    url: `/oss-saas/api-v1/asset/package/count/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 应用包审查任务依赖关系图
export function dependTreeChart (data) {
  return fetch({
    url: '/oss-saas/api-v1/asset/package/component/tree',
    method: 'get',
    params: data
  })
}

// 取应用包审查任务组件最大依赖层级
export function getAssetMaxDependency (data) {
  return fetch({
    url: '/oss-saas/api-v1/asset/package/component/maxDependency',
    method: 'get',
    params: data
  })
}

// 查询开源项目详情
export function getOpenProjectInfo (data) {
  return fetch({
    url: '/oss/api-v1/asset/sourceCheck/result/getProjectInfo',
    method: 'get',
    params: data
  })
}
