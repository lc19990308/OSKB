<template>
  <div
    id="login-container"
    class="login h-full"
    :style="loginDynamicStyle"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <dialog-disclaimer ref="disclaimer"></dialog-disclaimer>
    <dialog-force-login ref="forceLogin" callback="forceLogin"></dialog-force-login>
    <div class="scene-layer scene-radar"></div>
    <div class="scene-layer scene-glow"></div>
    <div class="scene-layer scene-wave wave-back"></div>
    <div class="scene-layer scene-wave wave-front"></div>
    <div class="scene-layer cursor-ripple"></div>
    <div class="scene-layer cursor-foam"></div>
    <div class="login-content">
      <div v-show="!!brandLogoUrl" class="top-logo">
        <img :src="brandLogoUrl" alt="">
      </div>
      <div class="login-wrap">
        <div class="panel-heading">
          <div class="logo-wrap" v-show="!!loginLogoUrl">
            <img class="login-logo" :src="loginLogoUrl" alt="">
          </div>
          <div class="title-wrap">
            <p class="app-kicker">MARITIME SECURITY CONSOLE</p>
            <h4 class="app-name">{{ siteName }}</h4>
            <p class="app-summary">面向数字供应链的海上护航控制台</p>
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
        password: 'Xmirror!@#123',
        user: 'xmirror'
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
      mouseX: 0,
      mouseY: 0,
      rippleOpacity: 0
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
    }),
    loginDynamicStyle () {
      return {
        '--cursor-x': `${this.mouseX}px`,
        '--cursor-y': `${this.mouseY}px`,
        '--ripple-opacity': this.rippleOpacity,
        '--drift-x': `${(this.mouseX - window.innerWidth / 2) / 90}px`,
        '--drift-y': `${(this.mouseY - window.innerHeight / 2) / 120}px`
      }
    }
  },
  methods: {
    isArray,
    handleMouseMove (event) {
      this.mouseX = event.clientX
      this.mouseY = event.clientY
      this.rippleOpacity = 1
    },
    handleMouseLeave () {
      this.mouseX = window.innerWidth * 0.72
      this.mouseY = window.innerHeight * 0.72
      this.rippleOpacity = 0
    },
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
    this.handleMouseLeave()
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
  background-color: rgba(8, 26, 46, 0.28) !important;
  border: 1px solid rgba(143, 214, 255, 0.72) !important;
  border-radius: 4px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

:deep(.disclaimer .el-checkbox__inner:hover) {
  border-color: #b9e6ff !important;
  box-shadow: 0 0 0 3px rgba(143, 214, 255, 0.12);
}

:deep(.disclaimer .el-checkbox__input.is-checked .el-checkbox__inner) {
  background: linear-gradient(180deg, rgba(62, 124, 177, 0.92) 0%, rgba(44, 95, 138, 0.92) 100%) !important;
  border-color: #8fd6ff !important;
}

:deep(.disclaimer .el-checkbox__inner::after) {
  border-color: #eff9ff !important;
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
  --cursor-x: 70%;
  --cursor-y: 72%;
  --ripple-opacity: 0;
  --drift-x: 0px;
  --drift-y: 0px;
  background-color: #091b2e;

  &::after {
    content: "";
    position: absolute;
    inset: -28px;
    background-image: url(~@/assets/images/login/ship-login-bg.png);
    background-position: calc(50% + var(--drift-x)) calc(50% + var(--drift-y));
    background-repeat: no-repeat;
    background-size: cover;
    transition: background-position 240ms ease-out;
    z-index: 0;
    pointer-events: none;
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(7, 19, 34, 0.22) 0%, rgba(7, 19, 34, 0.08) 34%, rgba(7, 19, 34, 0.2) 100%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(7, 19, 34, 0.24) 100%);
    pointer-events: none;
  }

  .scene-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  .scene-radar {
    background:
      radial-gradient(circle at 16% 42%, rgba(146, 206, 255, 0.14) 0, rgba(146, 206, 255, 0.05) 28%, transparent 60%),
      radial-gradient(circle at 80% 76%, rgba(146, 206, 255, 0.08) 0, transparent 22%);
    opacity: 0.75;
    mix-blend-mode: screen;
    transform: translate3d(calc(var(--drift-x) * -0.5), calc(var(--drift-y) * -0.5), 0);
  }

  .scene-glow {
    background:
      radial-gradient(circle at 24% 70%, rgba(255, 255, 255, 0.18) 0, transparent 16%),
      radial-gradient(circle at 78% 84%, rgba(138, 214, 255, 0.12) 0, transparent 12%);
    opacity: 0.65;
    animation: seaGlow 9s ease-in-out infinite alternate;
    mix-blend-mode: screen;
  }

  .scene-wave {
    top: auto;
    height: 34%;
    bottom: -2%;
    background-repeat: repeat-x;
    background-size: 1200px 100%;
    opacity: 0.5;
  }

  .wave-back {
    background-image:
      radial-gradient(ellipse at 50% 100%, rgba(133, 203, 255, 0.16) 0, rgba(133, 203, 255, 0.12) 15%, transparent 55%),
      repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 24px, rgba(255, 255, 255, 0) 24px 48px);
    filter: blur(10px);
    animation: waveMove 18s linear infinite;
  }

  .wave-front {
    background-image:
      radial-gradient(ellipse at 50% 100%, rgba(198, 235, 255, 0.16) 0, rgba(198, 235, 255, 0.09) 16%, transparent 58%),
      repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.11) 0 40px, rgba(255, 255, 255, 0) 40px 76px);
    filter: blur(4px);
    animation: waveMoveReverse 12s linear infinite;
  }

  .cursor-ripple {
    opacity: var(--ripple-opacity);
    background:
      radial-gradient(circle at var(--cursor-x) var(--cursor-y), rgba(133, 214, 255, 0.26) 0, rgba(133, 214, 255, 0.16) 36px, rgba(133, 214, 255, 0.08) 78px, transparent 150px),
      radial-gradient(circle at calc(var(--cursor-x) + 28px) calc(var(--cursor-y) + 18px), rgba(255, 255, 255, 0.24) 0, transparent 28px);
    transition: opacity 0.35s ease;
    mix-blend-mode: screen;
  }

  .cursor-foam {
    opacity: calc(var(--ripple-opacity) * 0.95);
    background:
      radial-gradient(ellipse at var(--cursor-x) calc(var(--cursor-y) + 18px), rgba(255, 255, 255, 0.24) 0, rgba(255, 255, 255, 0.12) 16px, transparent 62px),
      radial-gradient(ellipse at calc(var(--cursor-x) - 24px) calc(var(--cursor-y) + 24px), rgba(255, 255, 255, 0.14) 0, transparent 54px);
    filter: blur(2px);
    transition: opacity 0.35s ease;
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
        filter: drop-shadow(0 8px 18px rgba(5, 20, 36, 0.28));
      }
    }

    .login-wrap {
      width: 460px;
      max-width: 100%;
      margin: 0 0 0 auto;
      text-align: left;
      min-height: 500px;
      padding: 34px 34px 28px;
      border: 1px solid rgba(255, 255, 255, 0.26);
      border-radius: 28px;
      background: linear-gradient(180deg, rgba(16, 42, 69, 0.54) 0%, rgba(8, 26, 46, 0.48) 100%);
      backdrop-filter: blur(12px);
      box-shadow: 0 28px 90px rgba(5, 20, 36, 0.24), inset 0 0 0 1px rgba(143, 214, 255, 0.08);
      position: relative;
      overflow: hidden;
      transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        border: 1px solid transparent;
        background:
          linear-gradient(120deg, rgba(143, 214, 255, 0) 0%, rgba(143, 214, 255, 0.45) 50%, rgba(143, 214, 255, 0) 100%) border-box;
        -webkit-mask:
          linear-gradient(#fff 0 0) padding-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.25s ease;
        pointer-events: none;
      }

      &:hover {
        border-color: rgba(143, 214, 255, 0.38);
        box-shadow: 0 34px 100px rgba(5, 20, 36, 0.3), 0 0 0 1px rgba(143, 214, 255, 0.16);
        transform: translateY(-2px);

        &::after {
          opacity: 1;
        }
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
        color: rgba(166, 212, 255, 0.88);
        letter-spacing: 0.22em;
        font-size: 12px;
      }

      .app-summary {
        margin: 8px 0 0;
        color: rgba(220, 235, 247, 0.72);
        font-size: 13px;
      }

      .app-name {
        font-size: 24px;
        color: #fff;
        font-weight: 600;
        margin: 0;
        line-height: 1.2;
        display: inline-block;
        background-image: linear-gradient(90deg, #f4fbff 0%, #b9e6ff 45%, #ffffff 100%);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        -webkit-background-clip: text;
        background-clip: text;
        transition: filter 0.25s ease, text-shadow 0.25s ease, transform 0.25s ease;

        &:hover {
          color: transparent;
          text-shadow: 0 0 22px rgba(143, 214, 255, 0.28);
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
            color: #fff;
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
            border-color: #8fd6ff;
          }

          :deep(.el-radio__inner) {
            width: 18px;
            height: 18px;
            background: transparent;
            border: 2px solid rgba(143, 214, 255, 0.9);
            box-shadow: 0 0 0 2px rgba(143, 214, 255, 0.08);

            &::after {
              width: 6px;
              height: 6px;
              background-color: #8fd6ff;
            }
          }

          :deep(.el-radio__input.is-checked + .el-radio__label) {
            color: #dff3ff;
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
          border: 1px solid rgba(255, 255, 255, 0.86);
          background-color: rgba(6, 20, 35, 0.16);
          color: #fff;
          border-radius: 10px;
          box-sizing: border-box;
          transition: border-color 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease;

          &:hover,
          &:focus {
            border-color: #8fd6ff;
            box-shadow: 0 0 0 3px rgba(143, 214, 255, 0.12);
            background-color: rgba(6, 20, 35, 0.24);
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
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          color: rgba(201, 223, 239, 0.88);
          margin-top: 18px;
          font-size: 13px;

          :deep(.el-link) {
            margin-left: 10px;
            color: rgba(173, 214, 242, 0.92) !important;
            transition: color 0.2s ease, text-shadow 0.2s ease;

            &:hover {
              color: #e8f7ff !important;
              text-shadow: 0 0 14px rgba(143, 214, 255, 0.22);
            }
          }
        }
      }

      .login-op {
        padding: 10px 0 2px;
        text-align: left;

        :deep(.el-link) {
          float: left !important;
          display: inline-block;
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
      padding: 28px 20px 24px;
      border-radius: 22px;
    }

    .login-content .login-wrap .panel-heading {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .login-content .login-wrap .app-name {
      font-size: 24px;
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
  color: rgba(216, 232, 244, 0.9);
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

@keyframes seaGlow {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(0, -6px, 0);
  }
}

@keyframes waveMove {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-120px);
  }
}

@keyframes waveMoveReverse {
  0% {
    transform: translateX(-40px);
  }

  100% {
    transform: translateX(120px);
  }
}

</style>

<style lang="scss">
.forget-pwd-popover {
  border: 1px solid rgba(143, 214, 255, 0.22) !important;
  border-radius: 16px !important;
  background:
    radial-gradient(circle at top, rgba(84, 147, 202, 0.16) 0, transparent 34%),
    linear-gradient(180deg, rgba(17, 44, 73, 0.96) 0%, rgba(8, 26, 46, 0.98) 100%) !important;
  box-shadow: 0 20px 50px rgba(5, 20, 36, 0.28) !important;
  color: rgba(216, 232, 244, 0.9) !important;
  padding: 16px 18px !important;
}

.forget-pwd-popover[x-placement^="top"] .popper__arrow,
.forget-pwd-popover[x-placement^="top"] .popper__arrow::after {
  border-top-color: rgba(17, 44, 73, 0.96) !important;
}

.forget-pwd-popover .el-popover__title {
  color: #e8f7ff !important;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
