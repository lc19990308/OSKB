<template>
  <div>
    <dialog-test-config ref="dialogTestConfig"></dialog-test-config>
    <div class="view-content" v-loading="configLoading">
      <div style="color: #333;background-color: #eff3f6;padding: 24px 15px;"> 邮件配置</div>
      <el-form size="medium" :disabled="!authorityFilter(2232)" :model="form" :rules="rules" ref="emailform"
               class="info-form" label-width="150px">
        <el-form-item label="服务器地址：" prop="host">
          <el-input class="input" placeholder="服务器地址" v-model="form.host"></el-input>
        </el-form-item>
        <el-form-item label="SMTP协议端口号：" prop="smtpPort">
          <el-input class="input m-r-15" placeholder="SMTP协议端口号" v-model="form.smtpPort"></el-input>
          <el-checkbox v-model="form.portSsl" :true-label="1" :false-label="0">SSL加密</el-checkbox>
        </el-form-item>
        <el-form-item label="邮箱地址：" prop="username">
          <el-input class="input" placeholder="邮箱地址" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="认证方式：" prop="authType">
          <el-radio-group style="margin-left: 0;" v-model="form.authType" @change="$refs.emailform.validateField('password')">
            <el-radio label="1" border>客户端授权码</el-radio>
            <el-radio label="2" border>邮箱密码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="form.authType === '1' ? '客户端授权码：' : '邮箱密码：'" prop="password" :rules="[
          {
            required: true,
            message: `请输入${form.authType === '1' ? '客户端授权码' : '邮箱密码'}`,
            trigger: 'change'
          }
        ]" style="margin-bottom: 40px;">
          <el-input class="input" :placeholder="form.authType === '1' ? '请输入客户端授权码' : '请输入邮箱密码'" show-password v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item v-if="authorityFilter(2232)" style="margin-bottom: 0;">
          <el-button size="medium" type="primary" @click="saveConfig">保存</el-button>
          <el-button size="medium" @click="testConfig">测试配置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import DialogTestConfig from './dialogTestConfig'
import { getEmailConfig, updateEmailConfig } from '@/api/home/system/warnConf/index'
import { validateEmail } from '@/utils/validate'

export default {
  name: 'warn',
  components: {
    DialogTestConfig
  },
  data () {
    const checkEmail = (rule, value, callback) => {
      if (value) {
        if (!validateEmail(value)) {
          callback(new Error('邮箱格式错误！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form: {
        host: '', // 邮件发件服务器
        smtpPort: '', // 邮件发件SMTP端口
        authType: '1', // 邮箱认证方式（1客户端授权码/2邮箱密码）
        username: '', // 邮箱
        password: '', // 发件人邮箱密码或者授权码
        portSsl: 1 //  0非加密端口/1加密端口
      },
      configLoading: false,
      rules: {
        host: [
          {
            required: true,
            message: '请输入发件服务器',
            trigger: 'change'
          }
        ],
        smtpPort: [
          {
            required: true,
            message: '请输入SMTP端口',
            trigger: 'change'
          }
        ],
        authType: [
          {
            required: true,
            message: '请选择邮箱认证方式',
            trigger: 'change'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'change'
          },
          {
            validator: checkEmail,
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        siteName: [
          {
            required: false,
            message: '请输入站点名称',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 测试配置
    testConfig () {
      this.$refs.dialogTestConfig.dialogVisible = true
    },

    // 获取邮件配置
    getConfig () {
      this.configLoading = true
      getEmailConfig({
        loading: false
      }).then(response => {
        this.configLoading = false
        const data = response.data
        for (const i in data) {
          this.form[i] = data[i]
        }
      }).catch(error => {
        this.configLoading = false
        if (error.message) {
          this.$message.error(error.message)
        }
      })
    },

    // 保存配置
    saveConfig () {
      this.$refs.emailform.validate((valid) => {
        if (valid) {
          updateEmailConfig({
            ...this.form
          }).then(response => {
            this.getConfig()
            this.$message.success('保存成功')
          }).catch(error => {
            if (error.message) {
              this.$message.error(error.message)
            }
          })
          this.$refs.emailform.clearValidate()
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    this.getConfig()
  }
}
</script>
<style scoped lang="scss">
.el-form {
  padding: 30px;
}

.input {
  width: 100%;
  max-width: 300px;
}

.el-radio-group {
  margin-left: 10px;
}

.el-radio {
  margin-right: 8px;
}
</style>
