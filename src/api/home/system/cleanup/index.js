import fetch from '@/utils/fetch'

export function clean (data) {
  return fetch({
    url: '/oss/api-v1/system/data/clean',
    method: 'post',
    data: data
  })
}

export function getCleanModules (data) {
  return fetch({
    url: '/oss/api-v1/system/data/clean/modules',
    method: 'get',
    params: data
  })
}

export function getCleanConfig () {
  return fetch({
    url: '/oss/api-v1/system/data/clean/config',
    method: 'get',
    params: { loading: false }
  })
}

export function putCleanConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/data/clean/config',
    method: 'put',
    data
  })
}

export function resetCleanConfig (data) {
  return fetch({
    url: '/oss/api-v1/system/data/clean/config/restore',
    method: 'put',
    data
  })
}
