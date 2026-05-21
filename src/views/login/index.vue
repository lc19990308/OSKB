<template>
  <div id="login-container" class="login h-full">
    <dialog-disclaimer ref="disclaimer"></dialog-disclaimer>
    <dialog-force-login ref="forceLogin" callback="forceLogin"></dialog-force-login>
    <div class="login-content">
      <div v-show="!!brandLogoUrl" class="top-logo">
        <img :src="brandLogoUrl" alt="">
      </div>
      <div class="login-wrap">
        <div class="logo-wrap" v-show="!!loginLogoUrl">
          <img class="login-logo" :src="loginLogoUrl" alt="">
        </div>
        <h4 class="app-name">{{ siteName }}</h4>
        <div class="login-form">
          <div class="login-type">
            <el-radio v-model="loginType" :label="0">本地登录</el-radio>
            <el-radio v-model="loginType" :label="2">LDAP</el-radio>
          </div>
          <div class="login-user">
            <input type="text" id="user" placeholder="用户名" v-model="formState.user"/>
          </div>
          <div class="login-pwd">
            <input type="password" id="pwd" placeholder="密码" v-model="formState.password"/>
          </div>
          <div class="disclaimer">
            <el-tooltip v-model="disclaimerTooltip" manual content="请勾选《免责声明》" placement="left" effect="light">
              <el-checkbox v-model="disclaimer"></el-checkbox>
            </el-tooltip>
            <el-link type="info" @click="readDisclaimer">我已阅读并同意《免责声明》</el-link>
          </div>
          <div class="login-submit">
            <TNcode v-if="loginVerifyType == 1" :imgCodeUrl="imgCodeUrl" :loginService="loginService"
                    :user="formState.user"
                    :password="formState.password"
                     :disclaimer="disclaimer"></TNcode>
            <el-button v-else @click="handleButtonLogin" type="primary"
                       :loading="loading"
                       style="height:  45px;"
                       class="block w-full m-t-10"
            >
              点击登录
            </el-button>
          </div>
          <div class="login-op clearfix">
            <!--            <el-link type="info" class="left" @click="register">注册</el-link>-->
            <el-popover
              placement="top"
              title="忘记密码？"
              width="300"
              trigger="hover">
              <div class="forget-pwd">
                <p>1、普通用户忘记密码，请联系管理员进行重置。</p>
                <p>2、管理员忘记密码，可联系厂商进行重置。</p>
                <p>3、修改密码成功后，登录后可进行再次修改。</p>
              </div>
              <el-link slot="reference" type="info" class="right">忘记密码？</el-link>
            </el-popover>
          </div>
          <div class="login-message">
            {{ message }}
          </div>
          <div class="oss-divider"
               v-if="isArray(ossoidcProperties.loginType) && ossoidcProperties.loginType.length > 0"
          >
            <div class="m-b-10">
              <span class="line"></span>
              <span style="margin: 0 5px;">其他登录方式</span>
              <span class="line"></span>
            </div>
            <div class="text-center">
              <el-tooltip effect="dark" content="SSO登录" placement="left">
                <img  @click="handleGjzq"
                      v-if="ossoidcProperties.loginType.includes(4)"
                      src="../../assets/images/svg/sso.svg" alt="">
              </el-tooltip>
              <el-tooltip effect="dark" content="OIDC登录" placement="right">
                <img  @click="handleOIDC"
                      class="m-l-20"
                      style="padding: 5px;box-sizing: border-box;"
                      v-if="ossoidcProperties.loginType.includes(1)"
                      src="../../assets/images/svg/keycloak_icon_512px.svg" alt="">
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright" v-if="!!copyright">
      <div style="font-size: 14px;margin-bottom: 7px;">守护数字供应链安全</div>
      {{ copyright }} <span class="ipv6">ipv6</span>
    </div>
    <img :src="bgImg" alt="" class="login-bg">
  </div>
</template>
<script>
import TNcode from '@/views/login/TNcode.vue'
import DialogForceLogin from './dialogForceLogin.vue'
import DialogDisclaimer from '@/components/dialog/dialogDisclaimer.vue'
import md5 from 'js-md5'
import { login, ldapLogin } from '@/api/login'
import { mapState } from 'vuex'
import { localStore, isArray, noop } from '@/utils'
import qs from 'qs'
import Vue from 'vue'

export default {
  name: 'Login',
  components: {
    TNcode,
    DialogForceLogin,
    DialogDisclaimer
  },
  data () {
    return {
      formState: {
        password: '',
        user: ''
      },
      disclaimerTooltip: false,
      visibleTooltip: false,
      loginType: 0,
      showLogin: false,
      disclaimer: false,
      imgCodeUrl: '',
      loginToken: '',
      past_time: null,
      message: '',
      errorTimeout: null,
      loading: false,
      bgImg: require('@/assets/images/bgtu.jpg')
    }
  },
  computed: {
    ...mapState({
      siteName: state => state.site.siteName,
      loginLogoUrl: state => state.site.loginLogoUrl,
      brandLogoUrl: state => state.site.brandLogoUrl,
      copyright: state => state.site.copyright,
      accessToken: state => state.login.accessToken,
      ossoidcProperties: state => state.site.ossoidcProperties,
      loginVerifyType: state => state.site.loginVerifyType
    })
  },
  methods: {
    isArray,
    handleButtonLogin () {
      if (this.disclaimer) {
        if (!this.formState.user) {
          this.createMessage('请输入账号')
        } else if (!this.formState.password) {
          this.createMessage('请输入密码')
        } else {
          this.loginService(undefined, undefined, 0)
        }
      } else {
        clearTimeout(this.timer)
        this.disclaimerTooltip = true
        this.timer = setTimeout(() => {
          this.disclaimerTooltip = false
        }, 1000)
      }
    },
    handleOIDC () {
      const params = qs.stringify({
        client_id: this.ossoidcProperties.keycloak.clientId,
        response_type: 'code'
        // redirect_uri: encodeURIComponent(location.origin + '/transfer')
      }, { encode: false })
      window.open(this.ossoidcProperties.keycloak.authUrl + '?' + params, '_self')
    },
    handleGjzq () {
      window.open('/oss/api-v1/system/user/oauth2/login/gjzq', '_self')
    },
    setLoginToken () {
      this.loginToken = md5.hex(new Date().getTime() + '.' + Math.random() * 10000)
      this.imgCodeUrl = `/oss/api-v1/system/slider/getSliderImage?sliderId=${this.loginToken}&R=${parseInt(Math.random() * 10000)}`
    },
    // 打开免责声明
    readDisclaimer () {
      this.$refs.disclaimer.dialogVisible = true
    },

    createMessage (message) {
      clearTimeout(this.errorTimeout)
      this.message = message
      this.errorTimeout = setTimeout(() => {
        this.message = ''
      }, 2000)
    },

    // 提交登录信息
    loginService (markoffset, callbackfun = noop, forceLogin = 0) {
      this.loading = true
      const loginService = this.loginType === 0 ? login : ldapLogin
      // eslint-disable-next-line eqeqeq
      const params = this.loginVerifyType == 1 ? {
        sliderId: this.loginToken,
        username: this.formState.user,
        password: this.formState.password,
        sliderX: markoffset,
        forceLogin: forceLogin
      } : {
        username: this.formState.user,
        password: this.formState.password,
        forceLogin: forceLogin
      }
      loginService(params).then(response => {
        callbackfun(true)
        localStorage.removeItem('tok')
        Vue.prototype.GLOBAL.token = null
        this.$store.dispatch('initSiteInfo', {
          key: 'loginType',
          val: 0
        })
        this.$store.dispatch('setAccessToken', response.data.token)
        this.$store.dispatch('setUserPower', response.data.permissionIdList)
        this.$store.dispatch('setUserInfo', response.data.userInfo)
        this.$store.dispatch('serFirstLogin', response.data.userInfo.firstLogin)
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
        localStore.set('disclaimer', 1)
      }).catch(error => {
        if (typeof error === 'object' && error.code === 401001) {
          this.$refs.forceLogin.dialogVisible = true
          this.$refs.forceLogin.forceLogin().then(() => {
            this.loginService(markoffset, callbackfun, 1)
          }, () => {
            callbackfun(false)
            this.setLoginToken()
          })
        } else {
          callbackfun(false)
          this.setLoginToken()
          this.createMessage(error.message)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.$message.closeAll()
    if (localStore.get('disclaimer') === '1') {
      this.disclaimer = localStore.get('disclaimer') === '1'
    }
    this.$store.dispatch('clearUserInfo')
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      from.path !== '/transfer' && vm.$message.closeAll()
    })
  },
  created () {
    window.clearVuexAlong(true, false) // 只清理 localStorage
    this.setLoginToken()
  }
}
</script>
<style lang="scss" scoped>
@media (max-height: 790px) and (min-height: 610px){
  .copyright {
    bottom: 15px !important;
  }
  .login-user,
  .login-pwd {
    height: 40px !important;
  }

  .login-user {
    margin: 0 auto 30px !important;
    &::before {
      width: 27px !important;
      height: 27px !important;
      top: 6px !important;
      left: 7px !important;
    }
  }

  .login-pwd {
    &::before {
      width: 27px !important;
      height: 27px !important;
      top: 6px !important;
      left: 7px !important;
    }
  }

  .disclaimer {
    margin-top: 20px !important;
  }

  :deep(.tn-code) {
    height: 50px !important;
    .slide_block_text {
      top: 32px !important;
    }

    .slide_block_arrows {
      top: 25px !important;
    }
  }
}

@media (max-height: 610px) {

  .login-wrap {
    height: 500px !important;
  }

  .app-name {
    margin: 20px 0 !important;
  }

  .copyright {
    bottom: 15px !important;
  }
  .login-user,
  .login-pwd {
    height: 36px !important;
  }

  .login-user {
    margin: 0 auto 28px !important;
    &::before {
      width: 25px !important;
      height: 25px !important;
      top: 5px !important;
      left: 7px !important;
    }
  }

  .login-pwd {
    &::before {
      width: 25px !important;
      height: 25px !important;
      top: 5px !important;
      left: 7px !important;
    }
  }

  .disclaimer {
    margin-top: 16px !important;
  }

  :deep(.tn-code) {
    height: 44px !important;
    .slide_block_text {
      top: 29px !important;
    }

    .slide_block {
      background-size: cover !important;
    }

    .slide_btn {
      background-size: cover !important;
    }

    .slide_block_arrows {
      top: 23px !important;
      left: 16px !important;
    }
  }
}

.oss-divider {
  color: #fff;

  .line {
    display: inline-block;
    width: 100px;
    border-top: 1px solid #ffffff;
    vertical-align: 5px;
  }

  div:nth-child(2) {
    text-align: center;

    img {
      width: 45px;
      transition: all 0.1s;
      border-radius: 50%;
      cursor: pointer;
      background-color: #ffffff;
    }

    img:hover {
      transform: scale(1.1);
    }
  }
}

:deep(.el-divider__text) {
  background-color: initial;
  color: #ffffff;
}

:deep(.el-checkbox__inner) {
  background-color: transparent !important;
}

@keyframes flylight1 {
  0% {
    left: 0;
    opacity: 0;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    left: 300px;
    opacity: 0;
  }
}

@keyframes flylight1 {
  0% {
    left: 0;
    opacity: 0;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    left: 300px;
    opacity: 0;
  }
}

@keyframes flylight {
  0% {
    left: 390px;
    opacity: 0;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    left: 0;
    opacity: 0;
  }
}

@keyframes flylight {
  0% {
    left: 390px;
    opacity: 0;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    left: 0;
    opacity: 0;
  }
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-text-fill-color: #ededed !important;
  box-shadow: 0 0 0 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}

.login {
  height: 100%;
  z-index: 1;
  overflow: hidden;
  position: relative;

  .login-bg {
    position: fixed;
    top: 0;
    z-index: -1;
    left: 0;
    min-width: 100%;
    min-height: 100%;
  }

  .login-content {
    display: flex;
    width: 100%;
    height: 100%;

    .top-logo {
      position: fixed;
      top: 7%;
      left: 3%;

      img {
        max-width: 120px;
        max-height: 90px;
      }
    }

    .login-wrap {
      width: 600px;
      margin: auto;
      text-align: center;
      height: 550px;

      .logo-wrap {
        position: relative;

        .login-logo {
          max-width: 600px;
          max-height: 120px;
        }

        &::after {
          content: "";
          display: block;
          background: url(~@/assets/images/light.png) no-repeat;
          background-size: 100% auto;
          position: absolute;
          width: 300px;
          height: 100px;
          top: 40px;
          left: 0;
          opacity: 0;
          animation-name: flylight1;
          animation-duration: 3s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        &::before {
          content: "";
          display: block;
          background: url(~@/assets/images/light.png) no-repeat;
          background-size: 100% auto;
          position: absolute;
          width: 200px;
          height: 100px;
          top: -40px;
          left: 0;
          animation-name: flylight;
          animation-duration: 3s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      }

      .app-name {
        font-size: 18px;
        color: #fff;
        font-weight: 500;
        text-align: center;
        margin: 46px 0;
      }

      .login-form {
        width: 390px;
        margin: 0 auto;

        input {
          outline: none;

          &::placeholder {
            color: #fff;
          }
        }

        .login-type,
        .login-user,
        .login-pwd {
          width: 390px;
          height: 46px;
          text-decoration: none;
          position: relative;
        }

        .login-type {
          text-align: left;

          :deep(.el-radio__label) {
            color: #FFFFFF;
          }
        }

        #user,
        #pwd {
          padding-left: 40px;
          font-size: 14px;
          width: 100%;
          height: 100%;
          border: 1px solid #fff;
          background-color: transparent;
          color: #fff;
          border-radius: 4px;
          box-sizing: border-box;
        }

        .login-user {
          margin: 0 auto 50px;
          position: relative;

          &::before {
            content: "";
            display: block;
            width: 30px;
            height: 30px;
            position: absolute;
            left: 6px;
            top: 7px;
            background-image: url(~@/assets/images/user.png);
            background-repeat: no-repeat;
            background-size: contain;
          }
        }

        .login-pwd {
          position: relative;

          &::before {
            content: "";
            display: block;
            width: 30px;
            height: 30px;
            position: absolute;
            left: 6px;
            top: 7px;
            background-image: url(~@/assets/images/password.png);
            background-repeat: no-repeat;
            background-size: contain;
          }
        }

        .login-message {
          //padding: 18px 0;
          height: 20px;
          color: $color-danger;
        }

        .disclaimer {
          text-align: left;
          color: #fff;
          margin-top: 30px;

          .el-link {
            margin-left: 10px;
            color: #fff;
          }
        }
      }

      .login-op {
        padding: 5px 0;
      }
    }
  }
}

.copyright {
  position: fixed;
  bottom: 20px;
  text-align: center;
  font-size: 13px;
  width: 100%;
  color: #fff;
  .ipv6 {
    border: 1px solid $color-primary;
    color: $color-primary;
    font-size: 12px;
    width: 30px;
    display: inline-block;
    margin-left: 10px;
  }
}

.forget-pwd {
  font-size: 13px;

  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}

.el-message {
  display: none !important;
}

</style>
