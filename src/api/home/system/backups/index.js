import fetch from '@/utils/fetch'
import store from '@/store/store'

// 立即备份
export function backupNow (data) {
  return fetch({
    url: '/oss/api-v1/system/dataBackupLog/backupNow',
    method: 'post',
    data: data
  })
}

// 批量删除数据备份日志
export function deleteBatch (data) {
  return fetch({
    url: '/oss/api-v1/system/dataBackupLog/deleteBatch',
    method: 'post',
    data: data
  })
}

// 分页获取数据备份日志列表
export function dataBackupLog (data) {
  return fetch({
    url: '/oss/api-v1/system/dataBackupLog/list',
    method: 'get',
    params: data
  })
}

// 获取数据备份页面配置
export function backupConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/getDataBackupSetting',
    method: 'get',
    params: data
  })
}

// 更新数据备份页面配置
export function updateConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/setting/updateBackupSetting',
    method: 'post',
    data: data
  })
}

// 下载数据备份文件
export function downloadBackup (data) {
  return `/oss/api-v1/system/dataBackupLog/download/?Authorization=Bearer ${store.state.login.accessToken}&id=${data.dataBackupLogId}`
}
