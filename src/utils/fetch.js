import axios from 'axios'
import * as GLOBAL from '@/utils/conf'
import { Loading, Message, MessageBox } from 'element-ui'
import store from '@/store/store'
import router from '@/router/router'
import qs from 'qs'
import { get } from 'lodash-es'
import { popup } from '@/components/public/Popup'
import Vue from 'vue'

const service = axios.create()
service.defaults.timeout = 6000000

service.interceptors.request.use(requestInterceptors, requestOnRejected)
service.interceptors.response.use(responseInterceptors, responseOnRejected)

// 请求拦截
function requestInterceptors (config) {
  processToken(config) // token
  paramsSerializer(config) // 参数序列化
  processLoading(config) // loading
  // processTerminationRequest(config) // 终止请求
  return config
}

// 请求拦截 -- 出错
function requestOnRejected (error) {
  return Promise.reject(error.response)
}

// 处理opensca接口的响应
function processOpenScaResponse (response) {
  let code = null
  let promise = null

  if (typeof response.data === 'object' && response.data.code !== undefined) {
    code = response.data.code
    switch (code) {
      case GLOBAL.AUTH_EVENTS.success:
        promise = Promise.resolve(response.data)
        break
      case GLOBAL.AUTH_EVENTS.loginTimeout:
        store.dispatch('refreshOpenScaToken')
        // eslint-disable-next-line prefer-promise-reject-errors
        promise = Promise.reject(401)
        break
      case GLOBAL.AUTH_EVENTS.notPermit:
        promise = Promise.reject(response.data)
        break
      default:
        promise = Promise.reject(response.data)
    }
  } else if (response.data instanceof Blob) {
    promise = Promise.resolve({ data: response.data, fileName: get(response, ['headers', 'content-disposition'], '').split('filename=')[1] })
  } else {
    const error = {
      code: 9999,
      message: '数据解析异常'
    }
    promise = Promise.reject(error)
  }

  return promise
}

// 处理oss接口的响应
function processOssResponse (response) {
  let code = null
  let promise = null
  if (typeof response.data === 'object' && response.data.code !== undefined) {
    code = response.data.code

    switch (code) {
      case GLOBAL.AUTH_EVENTS.success:
        promise = Promise.resolve(response.data)
        break
      case GLOBAL.AUTH_EVENTS.loginTimeout:
        if (router.currentRoute.path !== '/login') {
          const zhongtai = Vue.prototype.GLOBAL.token // location.href.split('?')[1]?.split('=')[0] === 'tok' ? location.href.split('?')[1]?.split('=')[1] : null
          const config = response.config

          if (zhongtai && `Bearer ${zhongtai}` !== config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${zhongtai}`
            return service(config)
          } else {
            promise = Promise.reject(response.data)
            store.dispatch('clearUserInfo')
            const timeoutMessageBox = document.getElementsByClassName('timeout-message-box')
            if (timeoutMessageBox.length === 0) {
              MessageBox({
                customClass: 'timeout-message-box',
                title: '强制退出提示',
                dangerouslyUseHTMLString: true,
                message: '' +
                '<p style="text-align: center">由于登录超时或账号已在其他设备登录<p>' +
                '<p style="text-align: center">当前账号将被强制登出！<p>',
                confirmButtonText: '知道了',
                beforeClose: (action, instance, done) => {
                  router.push({
                    path: '/login'
                  })
                  done()
                }
              })
            }
          }
        }
        setTimeout(() => {
          Message.closeAll()
        }, 2)
        break
      case GLOBAL.AUTH_EVENTS.notPermit:
        if (router.currentRoute.path !== '/login') {
          promise = Promise.reject(response.data)
          const timeoutMessageBox = document.getElementsByClassName('timeout-message-box')
          if (timeoutMessageBox.length === 0) {
            popup({
              title: '提示',
              width: '550px',
              confirmButtonText: '退出登录',
              cancelButtonText: '取消',
              center: false,
              customClass: 'timeout-message-box',
              render (h) {
                return h('el-row', {
                  class: 'font-base',
                  style: { padding: '20px' }
                }, [
                  h('div', {}, '无权限访问，请退出重新登录！ ')
                ])
              },
              beforeClose: (action, next) => {
                if (action === 'confirm') {
                  store.dispatch('clearUserInfo')
                  router.push({
                    path: '/login'
                  })
                  popup.closeAll()
                } else {
                  next()
                }
              }
            })
          }
        }
        break
      case GLOBAL.AUTH_EVENTS.notFound:
        // 判断是否是其他设备把项目删除。当前设备存的是已经删掉的项目。初始化项目
        store.dispatch('getProjectList')
        // eslint-disable-next-line prefer-promise-reject-errors
        promise = Promise.reject(null)
        router.replace({ path: '/404' })
        break
      default:
        promise = Promise.reject(response.data)
    }
  } else if (response.data instanceof Blob) {
    promise = Promise.resolve({ data: response.data, fileName: get(response, ['headers', 'content-disposition'], '').split('filename=')[1] })
  } else {
    const error = {
      code: 9999,
      message: '数据解析异常'
    }
    promise = Promise.reject(error)
  }
  return promise
}

// 响应拦截 -- 成功
function responseInterceptors (response) {
  closeLoading(response)
  if (response.config.url.slice(0, 9) === '/oss-saas') {
    return processOpenScaResponse(response)
  } else {
    return processOssResponse(response)
  }
}

// 响应拦截 -- 出错
function responseOnRejected (error) {
  window.loading && window.loading.close()
  if (typeof error === 'object' && error.message === 'cancel') {
    error = false
    return Promise.reject(error)
  } else {
    const response = error.response ? { message: error.response.statusText } : {}
    return Promise.reject(response)
  }
}

function processToken (config) {
  if (config.url.slice(0, 9) === '/oss-saas') { // 调opeSca这边的接口
    if (store.state.home.openscaToken) {
      config.headers.Authorization = `Bearer ${store.state.home.openscaToken}`
    }
  } else if (store.state.login.accessToken && !config.headers.OpenApiToken) {
    const zhongtai = localStorage.getItem('tok')
    config.headers.Authorization = `Bearer ${zhongtai || store.state.login.accessToken}`
  }
}

function paramsSerializer (config) {
  if (config.params && !config.paramsSerializer) {
    config.paramsSerializer = params => {
      return qs.stringify(params, { indices: false })
    }
  }
}

function processLoading (config) {
  if (config.data && config.data.loading !== undefined && config.data.loading === false) {
    delete config.data.loading
  } else if (config.params && config.params.loading !== undefined && config.params.loading === false) {
    delete config.params.loading
  } else if (config.data && config.data.loading !== undefined && config.data.loading === true) {
    delete config.data.loading
    config.loading = true
    window.loading = Loading.service({
      background: 'rgba(0, 0, 0, 0.5)',
      spinner: 'global-loading',
      text: '航行中'
    })
  } else if (config.params && config.params.loading !== undefined && config.params.loading === true) {
    delete config.data.loading
    config.loading = true
    window.loading = Loading.service({
      background: 'rgba(0, 0, 0, 0.5)',
      spinner: 'global-loading',
      text: '航行中'
    })
  } else {
    window.loading = Loading.service({
      background: 'rgba(0, 0, 0, 0.5)',
      spinner: 'global-loading',
      text: '航行中'
    })
    config.loading = true
  }
}

function closeLoading (response) {
  if (window.loading && response.config && response.config.loading) {
    window.loading.close()
  }
}

// const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识

// function removePending (ever) {
//   for (const p in pending) {
//     let a, b
//     if (ever.data) {
//       a = JSON.stringify(ever.data)
//     }
//     if (ever.params) {
//       b = JSON.stringify(ever.params)
//     }
//     const c = ever.url + '&' + ever.method + '&' + a + '&' + b
//     if (pending[p].u === c) { // 当前请求在数组中存在时执行函数体
//       pending[p].f('cancel') // 执行取消操作
//       pending.splice(p, 1) // 把这条记录从数组中移除
//     }
//   }
// }

// function processTerminationRequest (config) {
//   removePending(config)
//   if (!config.cancelToken) {
//     if (config.noCancel) {
//       delete config.noCancel
//     } else {
//       config.cancelToken = new axios.CancelToken((c) => {
//         let a, b
//         if (config.data) {
//           a = JSON.stringify(config.data)
//         }
//         if (config.params) {
//           b = JSON.stringify(config.params)
//         }
//         pending.push({ u: config.url + '&' + config.method + '&' + a + '&' + b, f: c })
//       })
//     }
//   }
// }

const cacheMap = new Map()
export default (config) => {
  const key = qs.stringify(config)
  if (cacheMap.has(key)) {
    return cacheMap.get(key)
  } else {
    const promise = service(config)

    cacheMap.set(key, promise)

    promise.finally(() => {
      cacheMap.delete(key)
    })
    return promise
  }
}
