import fetch from '@/utils/fetch'

// 获取git仓库类型
export function gitList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/types',
    method: 'get',
    params: { ...data, loading: false },
    noCancel: true
  })
}

// 获取协议list
export function agreementList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/protocols',
    method: 'get',
    params: { ...data, loading: false }
  })
}
// 获取分支
export function branchList (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/branches',
    method: 'post',
    data: { ...data, loading: false }
  })
}

// 保存并检测
export function saveConfig (data) {
  return fetch({
    url: '/oss/api-v1/asset/gitRepository/saveSingleConfig',
    method: 'post',
    data: { ...data, loading: false }
  })
}
