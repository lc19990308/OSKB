import fetch from '@/utils/fetch'

// 获取后台配置
export function getBackgroundSetting (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/getBackgroundSetting',
    method: 'get',
    params: data
  })
}

// 更新后台配置
export function updateBackgroundSetting (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/updateBackgroundSetting',
    method: 'post',
    data: data
  })
}
