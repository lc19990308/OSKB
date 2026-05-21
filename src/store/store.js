import Vue from 'vue'
import Vuex from 'vuex'
import createVuexAlong from 'vuex-along'
import home from '@/store/modules/home'
import login from '@/store/modules/login'
import site from '@/store/modules/site'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    home,
    login,
    site
  },
  plugins: [
    createVuexAlong({
      // 设置保存的集合名字，避免同站点下的多项目数据冲突
      name: 'oss-vuex-along',
      local: {
        list: [
          'login',
          'home.project',
          'home.openscaUserIds',
          'home.openscaToken',
          'home.projectList',
          'home.opticalUserList',
          'site.ossoidcProperties',
          'site.loginType'
        ]
      }
    })
  ]
})
