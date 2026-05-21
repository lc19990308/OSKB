import store from '@/store/store'

/**
 * 判断是否有权限
 * **/
export function authorityFilter (powerId) {
  let has = false
  if (powerId instanceof Array) {
    powerId.forEach(x => {
      if (store.state.login.userPower.includes(x)) {
        has = true
      }
    })
  } else {
    has = store.state.login.userPower.includes(powerId)
  }
  return has
}
