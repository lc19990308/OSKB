<template>
  <div id="app">
    <template v-if="licenseExpire === 1">
      <div class="authorization-bar" v-if="showAuthorizationBar">
      <span>
        <i class="el-icon-warning text-severity font-md"></i>
        产品授权许可证已过期，请联系技术人员重新授权
      </span>
        <el-link :underline="false" @click="close">不再提示</el-link>
      </div>
    </template>
    <router-view v-if="isReload" />
  </div>
</template>
<script>
import { getSiteInfo } from '@/api/public'
import bus from '@/utils/bus'
import { Loading } from 'element-ui'
import { localStore } from '@/utils'
import { loginZTSso } from '@/api/login'
import Vue from 'vue'
import { WHITE_LIST_ROUTERS } from '@/utils/conf'
export default {
  data () {
    return {
      isReload: true,
      showAuthorizationBar: localStorage.getItem('showAuthorizationBar') === null
    }
  },
  computed: {
    licenseExpire () {
      return this.$store.state.site.licenseExpire
    }
  },
  provide () {
    return {
      initSiteInfo: this.initSiteInfo,
      reload: this.reload
    }
  },
  methods: {
    initSiteInfo () {
      getSiteInfo({
        loading: false
      }).then(response => {
        const data = response.data
        this.$store.dispatch('initSiteInfo', { key: 'brandLogoUrl', val: data.brandLogoUrl })
        this.$store.dispatch('initSiteInfo', { key: 'faviconUrl', val: data.faviconUrl })
        this.$store.dispatch('initSiteInfo', { key: 'loginLogoUrl', val: data.loginLogoUrl })
        this.$store.dispatch('initSiteInfo', { key: 'navLogoUrl', val: data.navMenuIconUrl })
        this.$store.dispatch('initSiteInfo', { key: 'copyright', val: data.copyright })
        this.$store.dispatch('initSiteInfo', { key: 'siteName', val: data.loginPageTitle })
        this.$store.dispatch('initSiteInfo', { key: 'foldNavLogo', val: data.navMenuIconMiniUrl })
        this.$store.dispatch('initSiteInfo', { key: 'ossoidcProperties', val: data.ossoidcProperties || {} })
        this.$store.dispatch('initSiteInfo', { key: 'loginVerifyType', val: data.loginVerifyType || 1 })
        // 产品授权许可证是否过期 0否 1是
        this.$store.dispatch('initSiteInfo', { key: 'licenseExpire', val: data.licenseExpire || 0 })
        this.$store.dispatch('initSiteInfo', { key: 'licenseExpireTime', val: data.licenseExpireTime })
        this.$store.dispatch('initSiteInfo', { key: 'showViewSetting', val: data.showViewSetting })
        this.$store.dispatch('initSiteInfo', { key: 'binaryEnable', val: data.binaryEnable })
        this.$store.dispatch('initSiteInfo', { key: 'imageEnable', val: data.imageEnable })
        this.$store.dispatch('initSiteInfo', { key: 'homologyEnable', val: data.homologyEnable })
        this.$store.dispatch('initSiteInfo', { key: 'sourceCheckEnable', val: data.sourceCheckEnable })
        document.title = this.$store.state.site.siteName
        document.querySelector('link[rel="icon"]').href = data.faviconUrl || ''
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    reload () {
      this.isReload = false
      this.$nextTick(() => {
        this.isReload = true
      })
    },
    close () {
      this.showAuthorizationBar = false
      localStorage.setItem('showAuthorizationBar', '1')
    },
    ssoLogin (token, directUrl = null) {
      if (this.$route.path !== '/login') {
        this.isReload = false
      }
      const loadingInstance = Loading.service({
        background: 'rgba(0, 0, 0, 0.5)',
        spinner: 'el-icon-loading',
        text: '加载中...'

      })
      loginZTSso({ token, loading: false }).then(response => {
        this.$store.dispatch('initSiteInfo', {
          key: 'loginType',
          val: 3
        })
        this.$store.dispatch('setAccessToken', response.data.token)
        this.$store.dispatch('setUserPower', response.data.permissionIdList)
        this.$store.dispatch('setUserInfo', response.data.userInfo)
        this.$store.dispatch('serFirstLogin', response.data.userInfo.firstLogin)

        localStorage.setItem('tok', response.data.token)
        Vue.prototype.GLOBAL.token = response.data.token

        setTimeout(() => {
          this.isReload = true
          if (response.data.userInfo.firstLogin === 1 && (response.data.permissionIdList.indexOf(900) !== -1 || response.data.permissionIdList.indexOf(1000) !== -1)) {
            this.$router.push({
              path: '/guide'
            }).then(() => {
              loadingInstance.close()
            })
          } else {
            this.$router.push({
              path: this.$route.path === '/login' ? (directUrl || '/') : this.$route.path
            }).then(() => {
              loadingInstance.close()
            })
          }
        }, 500)
        localStore.set('disclaimer', 1)
      }).catch((error) => {
        loadingInstance.close()
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
        this.$store.dispatch('clearUserInfo')
        this.$router.push('/login').then(() => {
          this.isReload = true
        })
      })
    }
  },
  mounted () {
    this.initSiteInfo()
    bus.$on('initSiteInfo', () => {
      this.initSiteInfo()
    })
  },
  watch: {
    '$route' (to) {
      if (to.query.token && !WHITE_LIST_ROUTERS.some(route => to.path.toLowerCase().includes(route))) {
        this.ssoLogin(to.query.token, to.query.directUrl)
      }
      this.$nextTick(() => {
        const wrap = document.getElementsByClassName('el-main')
        if (wrap && wrap.item(0)) {
          wrap.item(0).scrollTop = 0
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.authorization-bar {
  position: relative;
  height: 45px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fef0f0;
  color: $color-serious;;
  z-index: 99999;
}
</style>
