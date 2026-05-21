import fetch from '@/utils/fetch'

// 项目列表
export function projectList (data) {
  return fetch({
    noCancel: true,
    url: '/oss/api-v1/asset/project/select',
    method: 'get',
    params: {
      loading: false,
      ...data
    }
  })
}

// 项目添加
export function projectAdd (data) {
  return fetch({
    url: '/oss/api-v1/asset/project/add',
    method: 'post',
    data: data
  })
}

// 项目删除
export function projectDel (data) {
  return fetch({
    url: `/oss/api-v1/asset/project/delete/${data.id}`,
    method: 'post',
    data: {}
  })
}

// 项目编辑
export function projectUpdate (data) {
  return fetch({
    url: '/oss/api-v1/asset/project/update',
    method: 'post',
    data: data
  })
}

// 获取单个项目详情
export function projectInfo (data) {
  return fetch({
    url: `/oss/api-v1/asset/project/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 分页获取项目删除记录
export function projectDelLog (data) {
  return fetch({
    url: '/oss/api-v1/asset/projectDelLog/list',
    method: 'get',
    params: data
  })
}

// 批量恢复项目
export function projectRecover (data) {
  return fetch({
    url: '/oss/api-v1/asset/projectDelLog/recover',
    method: 'post',
    params: data
  })
}

// 批量彻底删除项目
export function projectDelete (data) {
  return fetch({
    url: '/oss/api-v1/asset/projectDelLog/delete',
    method: 'post',
    params: data
  })
}
