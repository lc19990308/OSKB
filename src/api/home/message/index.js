import fetch from '@/utils/fetch'

// 获取告警列表
export function messageList (data) {
  return fetch({
    url: '/oss/api-v1/system/user/getUserMessageList',
    method: 'get',
    noCancel: true,
    params: data
  })
}

// 标记为已读
export function changeReadStatus (data) {
  return fetch({
    url: '/oss/api-v1/system/user/updateUserMessageReadStatusBatch',
    method: 'post',
    noCancel: true,
    data: data
  })
}

// 标记所有为已读
export function changeAllReadStatus (data) {
  return fetch({
    url: '/oss/api-v1/system/user/readMessageAll',
    method: 'post',
    data: data
  })
}

// 标记任务消息订阅
export function taskSubscribe (callback) {
  return {
    url: '/user/queue/task',
    callback: callback
  }
}

// 检测结果
export function checkResultSubscribe (callback) {
  return {
    url: '/user/queue/checkResult',
    callback: callback
  }
}

// 系统更新消息订阅
export function systemUpdateSubscribe (callback) {
  return {
    url: '/user/queue/systemUpgrade',
    callback: callback
  }
}

// 批量删除用户消息
export function delMessage (data) {
  return fetch({
    url: '/oss/api-v1/system/user/deleteUserMessageBatch',
    method: 'post',
    data: data
  })
}

// 清空用户消息
export function delAll (data) {
  return fetch({
    url: '/oss/api-v1/system/user/message/deleteAll',
    method: 'post',
    data: data
  })
}

// 获取用户消息详情
export function messageDetail (data) {
  return fetch({
    url: `/oss/api-v1/system/user/message/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 获取通知配置
export function getWarnConf (data) {
  return fetch({
    url: '/oss/api-v1/system/userNoticeConfig',
    method: 'get',
    data: data
  })
}

// 获取更新通知配置
export function updateWarnConf (data) {
  return fetch({
    url: '/oss/api-v1/system/userNoticeConfig/update',
    method: 'post',
    data: data
  })
}

// 获取重置通知配置
export function resetWarnConf (data) {
  return fetch({
    url: '/oss/api-v1/system/userNoticeConfig/reset',
    method: 'post',
    data: data
  })
}

// 获取重置通知配置
export function masterSwitch (data) {
  return fetch({
    url: '/oss/api-v1/system/userNoticeConfig/updateRiskMonitoringSwitchStatus',
    method: 'post',
    data: data
  })
}

// 测试webhook推送企业微信消息
export function testWorkWechatSend (data) {
  return fetch({
    url: '/oss/api-v1/system/userNoticeConfig/testWorkWechatSend',
    method: 'post',
    data: data
  })
}
