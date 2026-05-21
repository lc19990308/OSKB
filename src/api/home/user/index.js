import fetch from '@/utils/fetch'

// 用户列表
export function user (data) {
  return fetch({
    url: '/oss/api-v1/system/user/list',
    method: 'get',
    params: data
  })
}

// 添加用户
export function userAdd (data) {
  return fetch({
    url: '/oss/api-v1/system/user/add',
    method: 'post',
    data: data
  })
}

// 用户列表
export function userList (data) {
  return fetch({
    url: '/oss/api-v1/system/user/list',
    method: 'get',
    params: data
  })
}

// 获取用户信息
export function userInfo (data) {
  return fetch({
    url: `/oss/api-v1/system/user/${data.id}`,
    method: 'get',
    params: {
      loading: data.loading
    }
  })
}

// 删除用户
export function userDel (data) {
  return fetch({
    url: '/oss/api-v1/system/user/deleteBatch',
    method: 'post',
    data: data
  })
}

// 修改用户信息
export function userUpdate (data) {
  return fetch({
    url: '/oss/api-v1/system/user/update',
    method: 'post',
    data: data
  })
}

// 初始化用户密码
export function userInitPwd (data) {
  return fetch({
    url: '/oss/api-v1/system/user/initializePasswordBatch',
    method: 'post',
    data: data
  })
}

// 启用/禁用账号
export function changeEffective (data) {
  return fetch({
    url: '/oss/api-v1/system/user/changeEffectiveBatch',
    method: 'post',
    data: data
  })
}

// 修改密码
export function updatePassword (data) {
  return fetch({
    url: '/oss/api-v1/system/user/updatePassword',
    method: 'post',
    data: data
  })
}

// 获取所有角色
export function allRole () {
  return fetch({
    url: '/oss/api-v1/system/role/select',
    method: 'get',
    data: {}
  })
}

// 获取所有用户
export function allUser (data = {}) {
  return fetch({
    noCancel: true,
    url: '/oss/api-v1/system/user/select',
    method: 'get',
    data
  })
}

// 获取当前用户可见项目的负责人
export function allUserList () {
  return fetch({
    noCancel: true,
    url: '/oss/api-v1/asset/project/principal/all',
    method: 'get',
    data: {}
  })
}

// 修改密码
export function editPassword (data) {
  return fetch({
    url: '/oss/api-v1/system/user/updatePassword',
    method: 'post',
    data: data
  })
}

// 获取权限树
export function powerTree (data) {
  return fetch({
    url: '/oss/api-v1/system/permission/tree',
    method: 'get',
    params: data
  })
}

// 获取角色列表
export function roleList (data) {
  return fetch({
    url: '/oss/api-v1/system/role/list',
    method: 'get',
    params: data
  })
}

// 获取角色信息
export function roleInfo (data) {
  return fetch({
    url: `/oss/api-v1/system/role/${data.id}`,
    method: 'get',
    params: data
  })
}

// 删除角色
export function roleDel (data) {
  return fetch({
    url: `/oss/api-v1/system/role/delete/${data.id}`,
    method: 'post',
    data: {}
  })
}

// 添加角色
export function roleAdd (data) {
  return fetch({
    url: '/oss/api-v1/system/role/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function roleUpdate (data) {
  return fetch({
    url: '/oss/api-v1/system/role/update',
    method: 'post',
    data: data
  })
}

// 修改邮箱
export function updateEmail (data) {
  return fetch({
    url: '/oss/api-v1/system/user/updateEmail',
    method: 'post',
    data: data
  })
}

// 获取令牌
export function getToken () {
  return fetch({
    url: '/oss/api-v1/open/token/info',
    method: 'get',
    params: {
      loading: false
    }
  })
}

// 更新令牌
export function updateToken (data) {
  return fetch({
    url: '/oss/api-v1/open/token/update',
    method: 'post',
    data: data
  })
}

// 生成随机令牌并更新
export function randomToken (data) {
  return fetch({
    url: '/oss/api-v1/open/token/update/random',
    method: 'post',
    data: data
  })
}
