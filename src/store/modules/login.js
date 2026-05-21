import { loginOut } from '@/api/login'
import { Message } from 'element-ui'
import router from '@/router/router'
import to from '@/utils/await-to'

const login = {
  state: {
    accessToken: '',
    userPower: [],
    userInfo: {},
    firstLogin: 0
  },
  mutations: {
    SET_ACCESS_TOKEN (state, data) {
      state.accessToken = data
    },
    SET_USER_POWER (state, data) {
      state.userPower = data
    },
    SET_USER_INFO (state, data) {
      state.userInfo = data
    },
    SET_FIRST_LOGIN (state, data) {
      state.firstLogin = data
    }
  },
  actions: {
    setAccessToken ({ commit }, data) {
      commit('SET_ACCESS_TOKEN', data)
    },
    setUserPower ({ commit }, data) {
      commit('SET_USER_POWER', data)
    },
    serFirstLogin ({ commit }, data) {
      commit('SET_FIRST_LOGIN', data)
    },
    setUserInfo ({ commit }, data) {
      commit('SET_USER_INFO', data)
    },
    async loginOut ({ dispatch }, isJump = true) {
      const [err] = await to(loginOut({}))
      if (err && err.message) {
        Message.error(err.message)
      } else {
        dispatch('clearUserInfo')
        isJump && router.push('/login')
      }
    },
    clearUserInfo ({ commit, dispatch }) {
      commit('SET_USER_INFO', {})
      commit('SET_ACCESS_TOKEN', '')
      commit('SET_USER_POWER', [])
      dispatch('selectProject', null)
      dispatch('clearOpenScaConfig')
    }
  }
}
export default login
