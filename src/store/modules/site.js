const site = {
  state: {
    brandLogoUrl: '',
    faviconUrl: '',
    loginLogoUrl: '',
    navLogoUrl: '',
    foldNavLogo: '',
    copyright: '',
    siteName: '',
    ossoidcProperties: {},
    loginType: 0,
    loginVerifyType: 1,
    licenseExpire: 0,
    licenseExpireTime: '',
    binaryEnable: false,
    imageEnable: false,
    homologyEnable: false,
    showViewSetting: 0,
    ssoUrl: '/oss/api-v1/system/user/oauth2/login/pg',
    sourceCheckEnable: false
  },

  mutations: {
    INIT_SITE_INFO (state, { key, val }) {
      state[key] = val
    },
    SET_SITE_INFO (state, data) {
      state.brandLogoUrl = data.brandLogoUrl !== 'remove' ? data.brandLogoUrl : ''
      state.faviconUrl = data.faviconUrl !== 'remove' ? data.faviconUrl : ''
      state.navLogoUrl = data.navMenuIconUrl !== 'remove' ? data.navMenuIconUrl : ''
      state.loginLogoUrl = data.loginLogoUrl !== 'remove' ? data.loginLogoUrl : ''
      state.foldNavLogo = data.navMenuIconMiniUrl !== 'remove' ? data.navMenuIconMiniUrl : ''
      state.copyright = data.copyright
      state.siteName = data.loginPageTitle
    }
  },
  actions: {
    initSiteInfo ({ commit }, data) {
      commit('INIT_SITE_INFO', data)
    },
    setSiteInfo ({ commit }, data) {
      commit('SET_SITE_INFO', data)
    }
  }
}

export default site
