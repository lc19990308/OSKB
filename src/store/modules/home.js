import Vue from 'vue'
import { Message } from 'element-ui'
import { allUserList } from '@/api/home/user'
import { projectList } from '@/api/home/project'
import { awaitTo as to, isObject } from '@/utils'
import { getOpenScaToken } from '@/api/login/opensca'

const home = {
  state: {
    sidebarCollapse: false,
    project: null,
    defaultPath: '/overview',
    initProjectLoading: true,
    hideMenus: false,
    uploadList: {},
    opticalUserList: [],
    projectList: [],
    openscaToken: null,
    openscaUserIds: []
  },

  mutations: {
    SET_SIDEBAR_COLLAPSE (state) {
      state.sidebarCollapse = !state.sidebarCollapse
    },
    SELECT_PROJECT (state, data) {
      state.project = data
    },
    SET_OPEN_SCA_TOKEN (state, data) {
      state.openscaToken = get(data, 'openscaToken', null)
      state.openscaUserIds = get(data, 'openscaUserIds', [])
    },
    SET_HIDE_MENUS (state, data) {
      state.hideMenus = data
      if (data) {
        state.sidebarCollapse = true
      }
    },
    SET_UPLOAD_LIST (state, data) {
      if (data.progress === 100) {
        setTimeout(() => {
          Vue.delete(state.uploadList, data.id)
        }, 200)
      } else {
        Vue.set(state.uploadList, data.id, data)
      }
    },
    CANCEL_UPLOAD (state, data) {
      setTimeout(() => {
        Vue.delete(state.uploadList, data)
      }, 200)
    },
    SET_INIT_PROJECT_LOADING (state, data) {
      state.initProjectLoading = data
    },
    SET_DEFAULT_PATH (state, data) {
      state.defaultPath = data
    },
    SET_USER_LIST (state, data) {
      state.userList = data
    },
    SET_PROJECT_LIST (state, data) {
      state.projectList = data
    },
    SET_OPTICAL_USER_LIST (state, data) {
      state.opticalUserList = data
    }
  },
  actions: {
    setSidebarCollapse ({ commit }) {
      commit('SET_SIDEBAR_COLLAPSE')
    },
    async getOpenScaToken ({ commit, rootState }, projectId) {
      if (!(get(rootState, ['login', 'userPower'], []).includes(3400) && rootState.site.homologyEnable)) return
      const [error, result] = await to(getOpenScaToken(projectId))
      if (error && error.message) return Message.error(error.message)
      commit('SET_OPEN_SCA_TOKEN', get(result, 'data'))
    },
    async refreshOpenScaToken ({ commit, rootState }) {
      const [error, result] = await to(getOpenScaToken(rootState.home.project.id, { refreshToken: rootState.home.openscaToken }))
      if (error && error.message) {
        Message.error(error.message)
      } else if (result) {
        commit('SET_OPEN_SCA_TOKEN', result.data)
      }
    },
    clearOpenScaConfig ({ commit }) {
      commit('SET_OPEN_SCA_TOKEN', {})
    },
    selectProject ({ commit }, data) {
      commit('SELECT_PROJECT', data)
    },
    setDefaultPath ({ commit }, data) {
      commit('SET_DEFAULT_PATH', data)
    },
    setHideMenus ({ commit }, data) {
      commit('SET_HIDE_MENUS', data)
    },
    setUploadList ({ commit }, data) {
      commit('SET_UPLOAD_LIST', data)
    },
    setInitProjectLoading ({ commit }, data) {
      commit('SET_INIT_PROJECT_LOADING', data)
    },
    cancelUpload ({ commit }, data) {
      commit('CANCEL_UPLOAD', data)
    },
    async getOpticalUserList ({ commit, rootState }) {
      if (!rootState.login.accessToken) return
      const [error, result] = await to(allUserList())
      if (isObject(error)) return Message.error(error.message)

      commit('SET_OPTICAL_USER_LIST', result.data.map(item => ({
        value: item.userId,
        label: item.username,
        text: item.username,
        ...item
      })))
    },
    async getProjectList ({ commit, rootState }) {
      if (!rootState.login.accessToken) return
      const [error, result] = await to(projectList({ pageSize: -1, loading: false }))
      if (error && error.message) {
        Message.error(error.message)
        return error
      }
      const list = result.data.records.map(item => ({
        value: item.id,
        label: item.name,
        ...item
      }))
      commit('SET_PROJECT_LIST', list)
      commit('SET_INIT_PROJECT_LOADING', false)
      const head = list[0] ? list[0] : null
      if (!rootState.home.project || !(list.find(item => item.id === rootState.home.project.id))) {
        commit('SELECT_PROJECT', rootState.login.userInfo.userId === 1 ? { id: -1, name: '所有项目' } : head)
      }
      return list
    }
  }
}

export default home
