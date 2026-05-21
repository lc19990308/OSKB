
import fetch from '@/utils/fetch'

// 获取邮箱配置
export function getEmailConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/getMailSetting',
    method: 'get',
    params: data
  })
}

// 更新邮箱配置
export function updateEmailConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/updateMailSetting',
    method: 'post',
    data: data
  })
}

// 测试邮箱配置
export function testEmailConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/mail/sendTestMail',
    method: 'post',
    data: data
  })
}
