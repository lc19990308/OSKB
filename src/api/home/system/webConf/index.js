import fetch from '@/utils/fetch'

// 获取界面配置
export function getWebconf (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/getViewSetting',
    method: 'get',
    params: data
  })
}

// 更新界面配置
export function updateWebconf (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/updateViewSetting',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  })
}

// 恢复默认界面配置
export function resetWebconf (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/restoreDefaultViewSetting',
    method: 'post',
    data: data
  })
}
