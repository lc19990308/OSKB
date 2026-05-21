import fetch from '@/utils/fetch'

// 获取ldap基本配置
export function getLdapConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/ldap/config',
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 设置ldap基本配置
export function setLdapConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/ldap/update',
    method: 'post',
    data: data
  })
}

// 测试ldap基本配置
export function testLdapConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/ldap/test',
    method: 'post',
    data: data
  })
}
