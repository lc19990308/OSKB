<template>
  <div class="transfer">
    <div class="text-center" style="flex: 1;">
      <img class="m-b-10" src="../../assets/images/svg/login-log.svg" alt="">
      <div>
        <i class="el-icon-loading text-primary font-xxxl"></i>
        <p>登录中，请稍后</p>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import { awaitTo as to } from '@/utils'
import { yingmiLogin } from '@/api/login'
import { mapState } from 'vuex'

export default {
  name: 'transfer',
  created () {
    const url = location.search.slice(1)
    const params = qs.parse(url)
    if (!this.accessToken && params.code) {
      this.handleLogin(params)
    } else if (this.accessToken && params.code) {
      location.href = '/'
    } else {
      this.$router.push('/login')
    }
  },
  computed: {
    ...mapState({
      accessToken: state => state.login.accessToken
    })
  },
  methods: {
    async handleLogin (params) {
      const [error, response] = await to(yingmiLogin(params))
      if (error && error.message) {
        this.$message.error(error.message)
        this.$router.push('/login')
        return
      }

      this.$store.dispatch('initSiteInfo', {
        key: 'loginType',
        val: 1
      })
      this.$store.dispatch('setAccessToken', response.data.token)
      this.$store.dispatch('setUserPower', response.data.permissionIdList)
      this.$store.dispatch('setUserInfo', response.data.userInfo)
      this.$store.dispatch('serFirstLogin', response.data.userInfo.firstLogin)
      this.$store.dispatch('getProjectList')

      if (response.data.userInfo.firstLogin === 1 && (response.data.permissionIdList.indexOf(900) !== -1 || response.data.permissionIdList.indexOf(1000) !== -1)) {
        this.$router.push({
          path: '/guide'
        })
      } else {
        this.$router.push({
          path: '/'
        })
      }
    }
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
