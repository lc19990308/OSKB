// 路由劫持判断权限
import router from './router'
import store from '@/store/store'
import { MENUS, WHITE_LIST_ROUTERS } from '@/utils/conf'

const powerObj = {}
const func = (arr) => {
  if (Array.isArray(arr)) {
    arr.forEach(x => {
      if (x.submenu) {
        func(x.submenu)
      }
      if (x.powerId) {
        if (!!x.href && x.href !== '#') {
          powerObj[x.href] = x.powerId
        }
      }
    })
  }
}
func(MENUS)

router.beforeEach((to, from, next) => {
  let directUrl = null
  if (to.query.token && to.path !== '/login' && to.path !== '/') {
    directUrl = to.path
  }
  if ((!store.state.login.accessToken) && to.path !== '/login') {
    // 路由白名单放行
    if (WHITE_LIST_ROUTERS.some(route => to.path.toLowerCase().includes(route))) {
      next()
    } else {
      next({
        path: '/login',
        query: to.query ? {
          ...to.query,
          directUrl
        } : {}
      })
    }
  } else if (to.path === '/') {
    let path = '/login'
    for (const i in powerObj) {
      if (store.state.login.userPower.indexOf(powerObj[i]) !== -1) {
        path = i
        break
      }
    }

    if (to.query.token) {
      console.log('directUrl', directUrl)
      setTimeout(() => {
        // if (path === '/login') return Message.warning({ message: '没有页面访问权限，请联系管理员！', duration: 0 })
        next(path + `?token=${to.query.token}&directUrl=${directUrl}`)
      }, 1000)
    } else {
      setTimeout(() => {
        // if (path === '/login') return Message.warning({ message: '没有页面访问权限，请联系管理员！', duration: 0 })
        next(path)
      }, 1)
    }
  } else if (store.state.login.accessToken && to.path === '/login') {
    next('/')
  } else if (to.name === null) {
    next('/404')
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    let hasPower = false
    let path = null
    for (const x in powerObj) {
      if (store.state.login.userPower.indexOf(powerObj[x]) !== -1) {
        if (x === to.path) {
          hasPower = true
          break
        } else if (x.indexOf(to.path) === 0) {
          hasPower = true
          path = x
          break
        } else if (to.path.indexOf(x) === 0) {
          hasPower = true
          break
        }
      }
    }
    if (path !== null) {
      next(path)
    } else if (hasPower) {
      next()
    } else {
      next('/notPermissions')
    }
  } else if (to.path === '/login' && store.state.login.accessToken) {
    next('/')
  } else {
    next() // 确保一定要调用 next()
  }
  if (from.path === '/login' && to.path !== '/') {
    store.dispatch('setDefaultPath', to.path)
  }
})

export default router
