import fetch from '@/utils/fetch'
import store from '@/store/store'

// 获取用户token数据
export function getUserToken (data) {
  return fetch({
    url: '/iast/api-v1/system/jenkins/token',
    method: 'get',
    params: { loading: data.loading }
  })
}

// 生成用户token
export function generateUserToken (data) {
  return fetch({
    url: '/iast/api-v1/system/jenkins/token/generate',
    method: 'post',
    data: data
  })
}

// 下载jenkins插件
export function downloadPlugIn () {
  return `/iast/api-v1/system/jenkins/download?Authorization=Bearer ${store.state.login.accessToken}`
}

// 下载jenkins插件
export function downloadJenkinsPipeline () {
  return `/iast/api-v1/system/jenkins/download/pipeline?Authorization=Bearer ${store.state.login.accessToken}`
}
