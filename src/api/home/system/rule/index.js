import fetch from '@/utils/fetch'

// 获取自定义组件设置规则列表
export function componentRuleList (data) {
  return fetch({
    url: '/oss/api-v1/system/componentRule/list',
    method: 'get',
    params: data
  })
}

// 新增自定义组件设置规则
export function addComponentRule (data) {
  return fetch({
    url: '/oss/api-v1/system/componentRule/add',
    method: 'post',
    data: data
  })
}

// 批量物理删除自定义组件配置
export function delComponentRule (data) {
  return fetch({
    url: '/oss/api-v1/system/componentRule/physicDeleteBatch',
    method: 'post',
    data: data
  })
}

// 批量更改自定义组件规则启用
export function updateEffectiveStatusBatch (data) {
  return fetch({
    url: '/oss/api-v1/system/componentRule/updateEffectiveStatusBatch',
    method: 'post',
    data: data
  })
}
