import fetch from '@/utils/fetch'
import store from '@/store/store'

// 获取用户token数据
export function getUserToken (data) {
  return fetch({
    url: '/iast/api-v1/system/user/token',
    method: 'get',
    params: { loading: data.loading }
  })
}

// 生成用户token
export function generateUserToken (data) {
  return fetch({
    url: '/iast/api-v1/system/user/token/generate',
    method: 'post',
    data: data
  })
}

// 下载蓝鲸插件
export function downloadPlugIn (data) {
  return `/iast/api-v1/system/blue-shield/download/${data.type}?Authorization=Bearer ${store.state.login.accessToken}`
}
