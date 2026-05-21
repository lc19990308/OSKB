<script>
import qs from 'qs'
import { awaitTo as to, isObject } from '@/utils'
import { loginSSO } from '@/api/login'
export default {
  name: 'login-home',
  data () {
    return {
      params: undefined
    }
  },
  computed: {
    ssoUrl () {
      return this.$store.state.site.ssoUrl
    },
    token () {
      return this.$store.state.login.accessToken
    },
    isParams () {
      return this.params && isObject(this.params) && Object.keys(this.params).length
    }
  },
  async created () {
    this.$message.closeAll()
    this.parsedUrlToken()
    if (this.token) {
      this.$router.push('/login')
    } else if (!this.token && !this.isParams) {
      // this.$alert('跳转到登录界面', '登录失败', {
      //   type: 'error',
      //   confirmButtonText: '确定',
      //   callback: () => {
      //     this.$router.push('/login')
      //   }
      // })
      window.open('/oss/api-v1/system/user/oauth2/login/gjzq', '_self')
    } else if (!this.token && this.isParams) {
      await this.ssoLogin()
    }
  },
  methods: {
    parsedUrlToken () {
      const url = location.search.slice(1)
      this.params = qs.parse(url)
    },
    async ssoLogin () {
      const [error, response] = await to(loginSSO(this.params))
      if (error && error.message) {
        this.$alert('跳转到登录界面', error.message, {
          type: 'error',
          confirmButtonText: '确定',
          callback: () => {
            this.$router.push('/login')
          }
        })
        return
      }

      this.$store.dispatch('setAccessToken', response.data.token)
      this.$store.dispatch('setUserPower', response.data.permissionIdList)
      this.$store.dispatch('setUserInfo', response.data.userInfo)
      this.$store.dispatch('serFirstLogin', response.data.userInfo.firstLogin)
      this.$store.dispatch('getUserList')
      this.$store.dispatch('getProjectList')
      this.$store.dispatch('initSiteInfo', {
        key: 'loginType',
        val: 4
      })

      setTimeout(() => {
        if (response.data.userInfo.firstLogin === 1 && (response.data.permissionIdList.indexOf(900) !== -1 || response.data.permissionIdList.indexOf(1000) !== -1)) {
          this.$router.push({
            path: '/guide'
          })
        } else {
          this.$router.push({
            path: '/'
          })
        }
      }, 500)
    }
  },
  render (h) {
    return h('div', {}, null)
  }
}
</script>

<style lang="scss" scoped>
.transfer {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
