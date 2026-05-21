import fetch from '@/utils/fetch'
// SSO登录
export function loginSSO (data) {
  return fetch({
    url: '/oss/api-v1/system/user/oauth2/callback/gjzq',
    method: 'post',
    data: data
  })
}

// 清除sso登录信息地址
export function getClearSsoUrl () {
  return fetch({
    url: '/oss/api-v1/system/user/oauth2/logout/url',
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 登录
export function login (data) {
  return fetch({
    url: '/oss/api-v1/system/user/login',
    method: 'post',
    data: data
  })
}

// ldap登录
export function ldapLogin (data) {
  return fetch({
    url: '/oss/api-v1/system/user/ldap/login',
    method: 'post',
    data: data
  })
}

// 退出登录
export function loginOut (data) {
  return fetch({
    url: '/oss/api-v1/system/user/logout',
    method: 'post',
    data: data
  })
}

// 获取第三方登陆
export function yingmiLogin (data) {
  return fetch({
    url: '/oss/api-v1/system/user/yingmiLogin',
    method: 'post',
    data: data
  })
}

// 中泰sso登录
export function loginZTSso (data) {
  return fetch({
    url: '/oss/api-v1/system/user/zts/login',
    method: 'post',
    data: data
  })
}

// 获取国金证卷sso登录页面的跳转地址
export function getGjzqOauth2Url () {
  return fetch({
    url: '/oss/api-v1/system/user/oauth2/login/gjzq',
    method: 'get',
    params: {
      loading: false
    }
  })
}
