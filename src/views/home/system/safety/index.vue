<template>
  <div>
    <div class="view-content">
      <div class="m-b-15">
        登录策略：
        <el-switch
          :active-value="1"
          :inactive-value="0"
          :disabled="disabled"
          v-model="loginStrategySwitch" @change="setSecurityStrategy"></el-switch>
      </div>
      <panel title="用户登录锁定">
        <el-form :disabled="disabled" ref="loginLock" :rules="rules" :model="loginForm" label-width="180px" label-position="right">
          <el-form-item label="登录控制：">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="loginForm.loginControlSwitch" @change="loginConsoleChange"></el-switch>
          </el-form-item>
          <el-form-item label="鉴别失败设置：">
            用户登录失败超过
            <el-form-item class="inline-block" prop="loginFailTimeLimit">
              <el-input-number
                size="mini"
                v-model.number.lazy="loginForm.loginFailTimeLimit"
                controls-position="right"
                class="w-90"
                :controls="false"
                @change="loginFailCountChange"
              ></el-input-number>
              次/min，终止用户访问。
            </el-form-item>
          </el-form-item>
          <el-form-item label="访问白名单(通过IP控制)：">
            <el-switch
              v-model="loginForm.whiteListSwitch"
              :active-value="1"
              :inactive-value="0"
              @change="allowIpChange">
            </el-switch>
          </el-form-item>
        </el-form>
      </panel>
      <IpWhiteList :disabled="disabled" v-if="loginForm.whiteListSwitch === 1"/>
      <panel title="会话控制">
        <el-form :disabled="disabled" ref="sessionForm" :rules="rules" :model="sessionForm" label-width="130px" label-position="right">
          <el-form-item label="会话控制：">
            <el-switch
              v-model="sessionForm.sessionControlSwitch"
              :active-value="1"
              :inactive-value="0"
              @change="sessionControlChange"></el-switch>
          </el-form-item>
          <el-form-item label="鉴别失败设置：">
            <el-form-item class="inline-block" prop="sessionTimeout">
              <el-input-number
                size="mini"
                v-model.number.lazy="sessionForm.sessionTimeout"
                controls-position="right" class="w-90"
                @change="sessionTimeoutChange"
              ></el-input-number>
              min后，终止会话。
            </el-form-item>
          </el-form-item>
        </el-form>
      </panel>
      <panel title="登录验证">
        <el-form :disabled="disabled" ref="sessionForm" :rules="rules" :model="sessionForm" label-width="130px" label-position="right">
          <el-form-item label="登录验证方式：">
            <el-radio-group class="m-r-5" v-model="loginForm.loginVerifyType" @change="loginVerifyTypeChange">
              <el-radio :label="1">滑块验证登录</el-radio>
              <el-radio :label="2">按钮验证登录</el-radio>
            </el-radio-group>
          </el-form-item>
<!--          <el-form-item label=" ">-->
<!--            <el-button type="primary" size="medium">保存</el-button>-->
<!--            <el-button size="medium">重置</el-button>-->
<!--          </el-form-item>-->
        </el-form>
      </panel>
    </div>
  </div>
</template>

<script>
import IpWhiteList from '@/views/home/system/safety/ipWhiteList'
import { getSecuritySetting, updateSecuritySetting } from '@/api/home/system/safety/index'

export default {
  components: {
    IpWhiteList
  },
  inject: ['initSiteInfo'],
  data () {
    // 用户登录失败次数
    const loginNumValidator = (rule, value, callback) => {
      if (value <= 5 && value > 2) {
        callback()
      } else {
        callback(new Error())
      }
    }

    // 登录过期时间限制
    const sessionTimeoutValidator = (rule, value, callback) => {
      if (value <= 720 && value >= 30) {
        callback()
      } else {
        callback(new Error())
      }
    }
    return {
      loginStrategySwitch: 0, // 登录策略总开关
      getShellVal: '',
      loginForm: {
        loginControlSwitch: false, // 登录控制开关
        loginFailTimeLimit: 1, // 登录失败次数限制
        whiteListSwitch: false, // ip白名单开关
        loginVerifyType: 1
      },
      sessionForm: {
        sessionControlSwitch: false, // 会话控制开关
        sessionTimeout: 1 // 会话超时时间
      },
      rules: {
        loginFailTimeLimit: [
          { validator: loginNumValidator, message: '用户登录失败次数限制为<=5,>2', trigger: ['change', 'blur'] }
        ],
        sessionTimeout: [
          { validator: sessionTimeoutValidator, message: '过期时间限制为<=720min,>=30min', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  computed: {
    disabled () {
      return !this.authorityFilter(2242)
    }
  },
  methods: {
    // 初始化页面配置
    initControl () {
      getSecuritySetting({
        loading: false
      }).then((response) => {
        const data = response.data
        this.loginStrategySwitch = data.loginStrategySwitch
        this.$set(this.loginForm, 'loginControlSwitch', data.loginControlSwitch)
        this.$set(this.loginForm, 'loginFailTimeLimit', data.loginFailTimeLimit)
        this.$set(this.sessionForm, 'sessionControlSwitch', data.sessionControlSwitch)
        this.$set(this.sessionForm, 'sessionTimeout', data.sessionTimeout)
        this.$set(this.loginForm, 'whiteListSwitch', data.whiteListSwitch)
        this.loginForm.loginVerifyType = data.loginVerifyType
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 登录控制按钮更新
    loginConsoleChange () {
      updateSecuritySetting({
        loginControlSwitch: this.loginForm.loginControlSwitch
      }).then(() => {
        this.$message.success('修改成功')
        this.initControl()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 登录验证方式更改
    loginVerifyTypeChange () {
      updateSecuritySetting({
        loginVerifyType: this.loginForm.loginVerifyType
      }).then(() => {
        this.$message.success('修改成功')
        this.initControl()
        this.initSiteInfo()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 失败次数更新
    loginFailCountChange () {
      this.$refs.loginLock.validate((valid) => {
        if (valid) {
          this.$refs.loginLock.clearValidate()
          updateSecuritySetting({
            loginFailTimeLimit: this.loginForm.loginFailTimeLimit
          }).then(() => {
            this.$message.success('修改成功')
            this.initControl()
          }).catch(error => {
            if (typeof error === 'object') {
              this.$message.error(error.message)
            }
          })
        } else {
          this.initControl()
          return false
        }
      })
    },

    // 允许ip更新
    allowIpChange (value) {
      updateSecuritySetting({
        whiteListSwitch: this.loginForm.whiteListSwitch
      }).then(() => {
        this.$message.success('修改成功')
        this.initControl()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 会话开关
    sessionControlChange () {
      updateSecuritySetting({
        sessionControlSwitch: this.sessionForm.sessionControlSwitch
      }).then(() => {
        this.$message.success('修改成功')
        this.initControl()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 设置安全策略总开关
    setSecurityStrategy () {
      updateSecuritySetting({
        loginStrategySwitch: this.loginStrategySwitch
      }).then(() => {
        this.$message.success('操作成功！')
        this.initControl()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 会话超时
    sessionTimeoutChange () {
      this.$refs.sessionForm.validate((valid) => {
        if (valid) {
          this.$refs.sessionForm.clearValidate()
          updateSecuritySetting({
            sessionTimeout: this.sessionForm.sessionTimeout
          }).then(() => {
            this.$message.success('修改成功')
            this.initControl()
          }).catch(error => {
            if (typeof error === 'object') {
              this.$message.error(error.message)
            }
          })
        } else {
          this.initControl()
          return false
        }
      })
    }
  },
  mounted () {
    this.initControl()
  }
}
</script>
