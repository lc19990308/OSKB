<template>
  <div id="login-container" class="login h-full">
    <dialog-disclaimer ref="disclaimer"></dialog-disclaimer>
    <dialog-force-login ref="forceLogin" callback="forceLogin"></dialog-force-login>
    <div class="login-content">
      <div class="login-wrap">
        <div class="panel-heading">
          <div class="title-wrap">
            <h4 class="app-name">开源知识库系统</h4>
            <p class="app-summary"></p>
          </div>
        </div>
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
            <el-button @click="handleButtonLogin" type="primary"
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
              popper-class="forget-pwd-popover"
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
  </div>
</template>
<script>
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
      loading: false
    }
  },
  computed: {
    ...mapState({
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

:deep(.disclaimer .el-checkbox__inner) {
  background-color: rgba(28, 32, 39, 0.42) !important;
  border: 1px solid rgba(231, 194, 119, 0.72) !important;
  border-radius: 4px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

:deep(.disclaimer .el-checkbox__inner:hover) {
  border-color: #f2d28d !important;
  box-shadow: 0 0 0 3px rgba(231, 194, 119, 0.12);
}

:deep(.disclaimer .el-checkbox__input.is-checked .el-checkbox__inner) {
  background: linear-gradient(180deg, rgba(203, 145, 43, 0.92) 0%, rgba(152, 96, 24, 0.92) 100%) !important;
  border-color: #e7bb65 !important;
}

:deep(.disclaimer .el-checkbox__inner::after) {
  border-color: #f3fff6 !important;
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
  width: 100%;
  z-index: 1;
  overflow: hidden;
  position: relative;
  contain: layout paint;
  background-color: var(--ossm-primary);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(~@/assets/images/login/login-tech-bg.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 0;
    pointer-events: none;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(183, 121, 31, 0.1) 0%, rgba(255, 255, 255, 0.02) 36%, rgba(28, 33, 41, 0.1) 100%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(183, 121, 31, 0.1) 100%);
    z-index: 1;
    pointer-events: none;
  }

  .login-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 100px 4vw 40px 24px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;

    .top-logo {
      position: fixed;
      top: 40px;
      left: 48px;
      z-index: 2;

      img {
        max-width: 148px;
        max-height: 96px;
        filter: drop-shadow(0 8px 18px rgba(15, 17, 21, 0.28));
      }
    }

    .login-wrap {
      width: 460px;
      max-width: 100%;
      margin: 0 0 0 auto;
      text-align: left;
      min-height: 500px;
      padding: 34px 34px 28px;
      border: 1px solid rgba(231, 194, 119, 0.32);
      border-radius: 20px;
      background:
        linear-gradient(145deg, rgba(38, 41, 48, 0.72) 0%, rgba(27, 30, 36, 0.6) 52%, rgba(20, 23, 29, 0.68) 100%),
        linear-gradient(180deg, rgba(231, 194, 119, 0.11) 0%, rgba(255, 255, 255, 0.025) 100%);
      backdrop-filter: blur(20px) saturate(128%);
      -webkit-backdrop-filter: blur(20px) saturate(128%);
      box-shadow: 0 28px 90px rgba(10, 12, 15, 0.44), inset 0 1px 0 rgba(255, 249, 236, 0.14);
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(112deg, rgba(255, 240, 207, 0.12) 0%, rgba(216, 164, 71, 0.035) 28%, transparent 58%);
        pointer-events: none;
      }

      .panel-heading,
      .login-form {
        position: relative;
        z-index: 1;
      }

      .panel-heading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        margin-bottom: 24px;
        text-align: center;
      }

      .logo-wrap {
        position: relative;
        flex: 0 0 auto;

        .login-logo {
          max-width: 170px;
          max-height: 78px;
          display: block;
        }
      }

      .title-wrap {
        min-width: 0;
      }

      .app-kicker {
        margin: 0 0 8px;
        color: rgba(240, 209, 148, 0.88);
        letter-spacing: 0.22em;
        font-size: 12px;
      }

      .app-summary {
        margin: 8px 0 0;
        color: rgba(232, 229, 221, 0.72);
        font-size: 13px;
      }

      .app-name {
        font-size: 24px;
        color: #fff;
        font-weight: 600;
        margin: 0;
        line-height: 1.2;
        display: inline-block;
        background-image: linear-gradient(90deg, #fffaf0 0%, #f2c979 45%, #fff4df 100%);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        -webkit-background-clip: text;
        background-clip: text;
        transition: filter 0.25s ease, text-shadow 0.25s ease, transform 0.25s ease;

        &:hover {
          color: transparent;
          text-shadow: 0 0 22px rgba(231, 194, 119, 0.28);
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
      }

      .login-form {
        width: 100%;
        max-width: 360px;
        margin: 0 auto;
        text-align: center;

        input {
          outline: none;

          &::placeholder {
            color: rgba(217, 241, 225, 0.66);
          }
        }

        .login-type,
        .login-user,
        .login-pwd {
          width: 100%;
          height: 46px;
          text-decoration: none;
          position: relative;
        }

        .login-type {
          text-align: center;
          margin-bottom: 18px;

          :deep(.el-radio) {
            margin-right: 24px;
          }

          :deep(.el-radio__input.is-checked .el-radio__inner),
          :deep(.el-radio__input.is-focus .el-radio__inner),
          :deep(.el-radio__inner:hover) {
            border-color: #e7bb65;
          }

          :deep(.el-radio__inner) {
            width: 18px;
            height: 18px;
            background: transparent;
            border: 2px solid rgba(231, 194, 119, 0.9);
            box-shadow: 0 0 0 2px rgba(231, 194, 119, 0.08);

            &::after {
              width: 6px;
              height: 6px;
              background-color: #e7bb65;
            }
          }

          :deep(.el-radio__input.is-checked + .el-radio__label) {
            color: #dbf4e4;
          }

          :deep(.el-radio__label) {
            color: rgba(255, 255, 255, 0.88);
            transition: color 0.2s ease;
          }
        }

        #user,
        #pwd {
          padding-left: 40px;
          font-size: 14px;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(186, 235, 201, 0.34);
          background: linear-gradient(110deg, rgba(30, 33, 40, 0.58) 0%, rgba(84, 68, 38, 0.2) 100%);
          color: #fffaf0;
          border-radius: 10px;
          box-sizing: border-box;
          box-shadow: inset 0 1px 0 rgba(224, 255, 230, 0.08);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;

          &:hover,
          &:focus {
            border-color: rgba(223, 169, 74, 0.72);
            box-shadow: 0 0 0 3px rgba(196, 139, 43, 0.16), inset 0 1px 0 rgba(241, 202, 123, 0.1);
            background: linear-gradient(110deg, rgba(36, 34, 27, 0.66) 0%, rgba(115, 80, 29, 0.3) 100%);
          }
        }

        .login-user {
          margin: 0 auto 20px;
          position: relative;

          &::before {
            content: "";
            display: block;
            width: 30px;
            height: 30px;
            position: absolute;
            left: 6px;
            top: 7px;
            z-index: 1;
            pointer-events: none;
            background-color: #efbf64;
            -webkit-mask: url(~@/assets/images/user.png) center / contain no-repeat;
            mask: url(~@/assets/images/user.png) center / contain no-repeat;
            filter: drop-shadow(0 0 3px rgba(239, 191, 100, 0.22));
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
            z-index: 1;
            pointer-events: none;
            background-color: #efbf64;
            -webkit-mask: url(~@/assets/images/password.png) center / contain no-repeat;
            mask: url(~@/assets/images/password.png) center / contain no-repeat;
            filter: drop-shadow(0 0 3px rgba(239, 191, 100, 0.22));
          }
        }

        .login-message {
          //padding: 18px 0;
          height: 20px;
          color: $color-danger;
        }

        .disclaimer {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          color: rgba(248, 245, 237, 0.9);
          margin-top: 18px;
          font-size: 13px;

          :deep(.el-link) {
            margin-left: 10px;
            color: #f0c675 !important;
            text-decoration: underline;
            text-underline-offset: 3px;
            transition: color 0.2s ease, text-shadow 0.2s ease;

            &:hover {
              color: #ffffff !important;
              text-shadow: 0 0 12px rgba(240, 198, 117, 0.24);
            }
          }
        }

        .login-submit {
          :deep(.el-button--primary) {
            border-color: rgba(238, 194, 109, 0.58);
            background: linear-gradient(135deg, #d19a3e 0%, #aa711e 52%, #825015 100%);
            color: #ffffff;
            box-shadow: 0 10px 22px rgba(68, 45, 16, 0.26), inset 0 1px 0 rgba(255, 224, 161, 0.16);

            &:hover,
            &:focus {
              border-color: rgba(255, 221, 150, 0.74);
              background: linear-gradient(135deg, #dfa948 0%, #bd7e24 52%, #905818 100%);
              color: #ffffff;
              box-shadow: 0 12px 26px rgba(68, 45, 16, 0.32), inset 0 1px 0 rgba(255, 230, 177, 0.18);
            }
          }
        }
      }

      .login-op {
        display: block;
        margin-top: 10px;
        padding: 0;
        text-align: left;

        :deep(.el-link) {
          display: inline-block;
          color: #f0c675 !important;
          text-decoration: underline;
          text-underline-offset: 3px;

          &:hover,
          &:focus {
            color: #ffffff !important;
            text-shadow: none;
          }
        }
      }
    }
  }
}

@media (max-width: 1366px) {
  .login {
    .login-content {
      padding: 92px 3vw 36px 24px;
    }

    .login-content .login-wrap {
      width: 440px;
      padding: 32px 28px 24px;
    }
  }
}

@media (max-width: 1100px) {
  .login {
    .login-content {
      padding: 96px 24px 40px;
      justify-content: center;
    }

    .login-content .login-wrap {
      margin: 0 auto;
      min-height: auto;
    }

    .login-content .top-logo {
      left: 24px;
      top: 24px;
    }
  }
}

@media (max-width: 768px) {
  .login {
    .login-content {
      padding: 88px 16px 24px;
    }

    .login-content .login-wrap {
      box-sizing: border-box;
      width: 100%;
      max-width: 440px;
      padding: 28px 20px 24px;
      border-radius: 22px;
    }

    .login-content .login-wrap .panel-heading {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .login-content .login-wrap .app-name {
      display: block;
      max-width: 100%;
      font-size: 24px;
      color: #fffaf0;
      background-image: none;
      -webkit-background-clip: initial;
      background-clip: initial;
      overflow-wrap: anywhere;
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
  color: rgba(229, 226, 218, 0.9);
  line-height: 1.7;

  p {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}

.el-message {
  display: none !important;
}

@keyframes backgroundFloat {
  0% {
    background-position: 50% 50%;
  }

  100% {
    background-position: calc(50% - 4px) calc(50% + 6px);
  }
}

</style>

<style lang="scss">
body:has(#login-container) {
  min-width: 0;
}

.forget-pwd-popover {
  border: 1px solid rgba(240, 198, 117, 0.42) !important;
  border-radius: 12px !important;
  background:
    linear-gradient(145deg, rgba(183, 121, 31, 0.8) 0%, rgba(112, 73, 20, 0.78) 100%),
    rgba(40, 36, 28, 0.7) !important;
  backdrop-filter: blur(18px) saturate(130%);
  -webkit-backdrop-filter: blur(18px) saturate(130%);
  box-shadow: 0 20px 50px rgba(10, 12, 15, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.18) !important;
  color: #ffffff !important;
  padding: 16px 18px !important;
}

.forget-pwd-popover[x-placement^="top"] .popper__arrow,
.forget-pwd-popover[x-placement^="top"] .popper__arrow::after {
  border-top-color: rgba(112, 73, 20, 0.88) !important;
}

.forget-pwd-popover .el-popover__title {
  color: #ffffff !important;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
