import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router/routerGuard'
import store from './store/store'
import ElementUI from 'element-ui'
import globalComponents from '@/components'
import globalMixins from '@/mixins/index.js' // 全局mixins
import '@/directive/directives.js'
import './assets/theme/index.css'
import './assets/fonts/iconFont/iconfont.css'
import './assets/fonts/iconFont/iconfont.js'
import './style/app.scss'
import './style/ossm-theme.scss'
import _global from './views/login/global'
import { MENUS } from '@/utils/conf'

// console.log = () => {}
Vue.use(ElementUI)
Vue.use(globalComponents)
Vue.mixin(globalMixins)
Vue.config.productionTip = false
Vue.prototype.GLOBAL = _global

// 联调测试：token 写死到浏览器 localStorage（DevTools → Application → Local Storage 查看/修改，key = 'tok'）
localStorage.setItem('tok', 'xPaXVa0o-k57lKHhgN3DdqIcoPqeYnj2RxklZRu8Rx8')

// 联调测试：远程登录接口未就绪，临时注入调试登录态以便进入系统（接口调通后删除此段）
// 每次启动都强制刷新，保证权限列表跟随代码更新（ops/submenu 里的 powerId 全收集）
store.commit('SET_ACCESS_TOKEN', 'debug-token')
store.commit('SET_USER_INFO', { userId: 1, userName: 'debug' })
const debugPowers = []
const collectPowerIds = (list) => {
  list.forEach(item => {
    if (item.powerId) debugPowers.push(item.powerId)
    if (item.submenu) collectPowerIds(item.submenu)
    if (item.ops) collectPowerIds(item.ops)
  })
}
collectPowerIds(MENUS)
store.commit('SET_USER_POWER', debugPowers)

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')
