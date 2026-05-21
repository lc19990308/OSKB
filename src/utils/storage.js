
function createLocalStore (type = 'localStorage') {
  return {
    set (key, value) {
      return window[type].setItem(key, JSON.stringify(value))
    },
    get (key, defaultValue) {
      const str = window[type].getItem(key)
      return JSON.parse(str) || defaultValue
    },
    remove (key) {
      return window[type].removeItem(key)
    }
  }
}

export const localStore = createLocalStore('localStorage')

export const sessionStore = createLocalStore('sessionStorage')
