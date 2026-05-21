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
import _global from './views/login/global'

// console.log = () => {}
Vue.use(ElementUI)
Vue.use(globalComponents)
Vue.mixin(globalMixins)
Vue.config.productionTip = false
Vue.prototype.GLOBAL = _global

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')
