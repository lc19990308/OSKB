<template>
  <el-dialog width="900px" @close="abort" :close-on-click-modal="false" title="API推送配置" :visible.sync="visible" append-to-body
             modal-append-to-body>

    <el-alert :closable="false" type="primary" class="header-alert">
      <div class="alert-content">
        <i class="el-icon-info"></i>
        全局的API推送配置（平台级），启用并设置 API 推送配置后，当集成部署检测完毕，会将Jenkins检测结果对应的漏洞黑名单数据推送至下列接口地址中。
      </div>
    </el-alert>

    <el-row class="m-b-15">
      <span>API推送：</span>
      <el-switch @change="$refs.ruleForm.resetFields()" v-model="formData.open"></el-switch>
    </el-row>

    <el-row class="form-container">
      <el-form :model="formData" :disabled="!formData.open" :rules="rules" size="medium" ref="ruleForm"  label-width="120px" class="rule-form">
        <el-form-item label="接口URL：" prop="url" style="margin-bottom: 30px;">
          <el-input style="width: 95%;" clearable placeholder="接口请求地址，如：https://localhost:8080/index.php/api/orders/add" v-model="formData.url"></el-input>
        </el-form-item>
        <el-form-item label="ACCESSKEY：" prop="accessKey" style="margin-bottom: 30px;">
          <el-input style="width: 95%;" clearable placeholder="数据接口认证，请输入Access Key数据值" v-model="formData.accessKey"></el-input>
        </el-form-item>
        <el-form-item label="SECRETKEY：" prop="secretKey" style="margin-bottom: 0;">
          <el-input style="width: 95%;" clearable placeholder="数据接口认证，请输入Secret Key数据值" v-model="formData.secretKey"></el-input>
        </el-form-item>
      </el-form>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <i v-if="testConnectionLoading" class="el-icon-loading text-primary m-r-5"></i>
      <el-link class="m-r-10" :disabled="!formData.open" type="primary" @click="testConnection">测试连接</el-link>
      <el-button type="primary" style="width: 70px;" size="medium" @click="submitForm">保 存</el-button>
      <el-button @click="resetForm" style="width: 70px;" size="medium">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import to from '@/utils/await-to'
import { getPushConfiguration, savePushConfiguration, testConnectionAipPush } from '@/api/home/scan/integration/sourceCode'
import { isObject } from '@/utils'
import { validateUrl } from '@/utils/validate'

export default {
  name: 'ApiPushDialog',
  data () {
    const validatorUrl = (rule, value, callback) => {
      if (value) {
        if (validateUrl(value)) {
          callback()
        } else {
          callback(new Error('格式不正确'))
        }
      } else {
        callback(new Error('请输入接口请求地址'))
      }
    }
    return {
      visible: false,
      testConnectionLoading: false,
      formData: {
        accessKey: '',
        secretKey: '',
        url: '',
        open: true
      },
      select: '',
      rules: {
        url: { validator: validatorUrl, required: true, trigger: 'change' },
        accessKey: { required: true, message: '请输入数据值', trigger: 'change' },
        secretKey: { required: true, message: '请输入数据值', trigger: 'change' }
      }
    }
  },
  methods: {
    async open () {
      const [error, response] = await to(getPushConfiguration())
      if (isObject(error)) return this.$message.error(error.message)
      this.visible = true
      this.formData.open = !!response.data.open
      this.formData.secretKey = response.data.secretKey
      this.formData.accessKey = response.data.accessKey
      this.formData.url = response.data.url
    },
    abort () {
      this.controller && this.controller.abort()
    },
    testConnection () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.testConnectionLoading) return
          this.testConnectionLoading = true
          this.controller = new AbortController()
          testConnectionAipPush(this.formData, this.controller.signal).then(res => {
            this.$message.success('连接成功')
          }).catch(error => {
            if (isObject(error) && error.message) return this.$message.error(error.message)
          }).finally(() => {
            this.testConnectionLoading = false
          })
        }
      })
    },
    submitForm () {
      if (!this.formData.open) {
        return this.submit()
      }
      this.$refs.ruleForm.validate((valid) => {
        valid && this.submit()
      })
    },
    async submit () {
      this.abort()
      const [error] = await to(savePushConfiguration(this.formData))
      if (isObject(error)) return this.$message.error(error.message)
      this.$message.success('保存成功')
      this.resetForm()
    },
    resetForm () {
      this.visible = false
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.rule-form {
  padding-top: 20px;
}

.form-container {
  border: 1px solid rgb(220, 222, 224);
  padding: 20px;
}

.header-alert {
  position: relative;
  padding-left: 12px !important;
  padding-right: 12px !important;
  margin-bottom: 20px;
  border-style: dashed;

  :deep(.el-alert__content) {
    padding: 0 !important;
    margin-bottom: 5px;
    font-size: 12px;
    color: rgb(51, 51, 51);

    .el-icon-info {
      color: #2C5F8A;
    }

    .handle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
