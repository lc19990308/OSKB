import fetch from '@/utils/fetch'

// 集成部署-镜像-查询列表
export function integrationImageList (data) {
  return fetch({
    url: '/oss/api-v1/asset/integration/image/list',
    method: 'get',
    params: data
  })
}

// 获取镜像tab页组件风险等级对应数量饼状图
export function componentLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/integration/image/securityLevelNumChart',
    method: 'get',
    params: data
  })
}

//  获取应用包下漏洞按风险等级分类及数量饼状图
export function vulLevelChart (data) {
  return fetch({
    url: '/oss/api-v1/asset/integration/image/vul/securityLevelNumChart',
    method: 'get',
    params: data
  })
}

// //  获取应用包下漏洞风险等级对应数量饼状图
// export function componentList (data) {
//   return fetch({
//     url: '/oss/api-v1/asset/integration/component/list',
//     method: 'get',
//     params: data
//   })
// }

// //  批量更改组件资产状态（标记为）
// export function changeStatus (data) {
//   return fetch({
//     url: '/oss/api-v1/asset/integration/component/changeStatusBatch',
//     method: 'post',
//     data: data
//   })
// }

// // 任务详情
// export function taskDetail (data) {
//   return fetch({
//     url: `/oss/api-v1/asset/integration/detail/${data.id}`,
//     method: 'get',
//     params: {
//       loading: data.loading
//     }
//   })
// }

// //  获取应用包审查任务下组件和漏洞计数信息
// export function taskCount (data) {
//   return fetch({
//     url: `/oss/api-v1/asset/integration/count/${data.id}`,
//     method: 'get',
//     params: {
//       loading: data.loading
//     }
//   })
// }

// // 组件资产详情
// export function componentDetail (data) {
//   return fetch({
//     url: `/oss/api-v1/asset/integration/component/${data.id}`,
//     method: 'get',
//     params: {
//       loading: data.loading
//     }
//   })
// }

// // 分页获取应用包审查任务下漏洞列表
// export function taskVulList (data) {
//   return fetch({
//     url: '/oss/api-v1/asset/integration/vul/list',
//     method: 'get',
//     params: data
//   })
// }

// // 获取项目token
// export function getToken (data) {
//   return fetch({
//     url: '/oss/api-v1/asset/integration/token',
//     method: 'get',
//     params: data
//   })
// }

// // 下载jenkins插件
// export function downloadJenkins (data) {
//   return fetch({
//     url: '/oss/api-v1/asset/integration/download',
//     method: 'get',
//     responseType: 'blob',
//     params: data
//   })
// }

// // jenkins持续集成模块接口
// export function licenseList (data) {
//   return fetch({
//     url: '/oss/api-v1/asset/integration/license/list',
//     method: 'get',
//     params: data
//   })
// }

// // 获取许可证路径列表 集成部署
// export function getLicenseUrlList (data) {
//   return fetch({
//     url: '/oss/api-v1/asset/integration/license/pathList',
//     method: 'get',
//     params: data
//   })
// }

// // 获取集成部署审查任务组件最大依赖层级
// export function getIntegrationMaxDependency (data) {
//   return fetch({
//     url: '/oss/api-v1/asset/integration/component/maxDependency',
//     method: 'get',
//     params: data
//   })
// }

// // 获取推送配置
// export function getPushConfiguration (data) {
//   return fetch({
//     url: '/oss/api-v1/custom/guosen/info',
//     method: 'get',
//     params: data
//   })
// }

// // 保存推送配置
// export function savePushConfiguration (data) {
//   return fetch({
//     url: '/oss/api-v1/custom/guosen/save',
//     method: 'post',
//     data: data
//   })
// }

// // api推送测试连接
// export function testConnectionAipPush (data, signal) {
//   return fetch({
//     signal,
//     url: '/oss/api-v1/custom/guosen/testConnection',
//     method: 'post',
//     data,
//     params: {
//       loading: false
//     }
//   })
// }

// export function downloadHtml (taskId, data) {
//   return fetch({
//     url: `/oss/api-v1/data/report/devops/html/download/${taskId}`,
//     method: 'post',
//     params: data
//   })
// }

// export function downloadExcel (taskId, data) {
//   return fetch({
//     url: `/oss/api-v1/data/report/devops/excel/download/${taskId}`,
//     method: 'post',
//     params: data
//   })
// }
