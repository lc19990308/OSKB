import fetch from '@/utils/fetch'

// 获取当前jira配置
export function getJiraConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/jira/config',
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 更新jira配置
export function setJiraConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/jira/update',
    method: 'post',
    data: data
  })
}

// 测试当前jira配置是否成功
export function testJiraConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/jira/test',
    method: 'post',
    data: data
  })
}

// 获取本平台字段列表
export function getList (data) {
  return fetch({
    url: '/oss/api-v1/system/jira/value/select',
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}
