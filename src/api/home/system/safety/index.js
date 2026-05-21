import fetch from '@/utils/fetch'

// 获取安全设置
export function getSecuritySetting (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/getSecuritySetting',
    method: 'get',
    params: data
  })
}

// 更新安全设置
export function updateSecuritySetting (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/updateSecuritySetting',
    method: 'post',
    data: data
  })
}

// 分页获取IP规则列表
export function getIpList (data) {
  return fetch({
    url: '/oss/api-v1/system/whiteList/list',
    method: 'get',
    params: data
  })
}

// 删除IP规则
export function delIp (data) {
  return fetch({
    url: '/oss/api-v1/system/whiteList/deleteBatch',
    method: 'post',
    data: data
  })
}

// 清空IP规则
export function emptyIp (data) {
  return fetch({
    url: '/oss/api-v1/system/whiteList/cleanIpWhiteList',
    method: 'post',
    data: data
  })
}

// 添加IP规则
export function addIp (data) {
  return fetch({
    url: '/oss/api-v1/system/whiteList/add',
    method: 'post',
    data: data
  })
}
