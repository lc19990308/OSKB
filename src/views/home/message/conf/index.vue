<template>
  <div class="view-content">
    <panel style="margin-bottom: 0;" v-loading="loading">
      <div slot="header">
        通知设置：
        <el-switch
          :active-value="1"
          :inactive-value="0"
          @change="masterSwitch"
          v-model="form.riskMonitoringSwitch"></el-switch>
      </div>
      <el-form
        size="medium"
        label-position="right"
        :disabled="!form.riskMonitoringSwitch"
        :model="form"
        :rules="rules"
        ref="ruleForm"
      >
        <!-- 监控内容 -->
        <el-form-item label="通知内容：">
          <el-form-item label="漏洞" label-width="120px">
            <el-checkbox-group v-model="form.vulNoticeLevelList" style="margin-left: 26px;">
              <el-checkbox :label="1" style="margin-left: 56px;">严重</el-checkbox>
              <el-checkbox :label="2">高危</el-checkbox>
              <el-checkbox :label="3">中危</el-checkbox>
              <el-checkbox :label="4">低危</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="组件" label-width="202px">
            <el-checkbox-group v-model="form.componentNoticeLevelList">
              <el-checkbox :label="1" style="margin-left: 56px;">严重</el-checkbox>
              <el-checkbox :label="2">高危</el-checkbox>
              <el-checkbox :label="3">中危</el-checkbox>
              <el-checkbox :label="4">低危</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="许可证" label-width="216px">
            <el-checkbox-group v-model="form.licenseNoticeLevelList">
              <el-checkbox :label="1" style="margin-left: 43px;">高风险</el-checkbox>
              <el-checkbox :label="2" style="margin-left: 15px;">中风险</el-checkbox>
              <el-checkbox :label="3" style="margin-left: 16px;">低风险</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form-item>

        <!-- 通知方式 -->
        <el-form-item label="通知方式：">
          <div class="card-box" style="margin-left: 160px;">
            <div class="flex between m-b-5">
              <span class="font-bold">站内通知</span>
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="form.websiteNoticeSwitch"></el-switch>
            </div>
            <div class="text-secondary">站内通知开启后，可在平台的消息通知内查看通知内容。</div>
          </div>
        </el-form-item>
        <el-form-item label="" label-width="160px">
          <div class="card-box">
            <div class="flex between m-b-5">
              <span class="font-bold">邮件通知</span>
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="form.mailNoticeSwitch"></el-switch>
            </div>
            <div class="text-secondary">邮件通知开启后，默认将通知内容发送至当前账号的邮箱中，若要修改接收消息的邮箱，可在【个人中心】中修改邮箱地址。</div>
          </div>
        </el-form-item>
        <el-form-item label="" label-width="160px">
          <div class="card-box">
            <div class="flex between m-b-5">
              <span class="font-bold">企业微信</span>
              <el-switch
                :active-value="1"
                :inactive-value="0"
                @change="[$refs.ruleForm.resetFields(), form.webhookUrl = '']"
                v-model="form.workWechatSwitch"></el-switch>
            </div>
            <div class="text-secondary m-b-5">配置企业微信webhook协议的自定义接入，实现相关通知自动推送到群。目前支持【集成部署】场景下检测结果的通知，具体配置方法请参考：
              <el-link type="primary" @click="openConfStep">
                配置步骤
              </el-link>。
            </div>
            <div>
              <span>Webhook地址：</span>
              <div style="display: inline-block;" class="m-r-20 close-el-form-item__label">
                <el-form-item label=" " prop="webhookUrl" :rules="
                    [
                      { required: form.workWechatSwitch === 1, message: '请填写Webhook地址', trigger: 'blur' },
                      { validator: validateUrl, message: '请填写正确格式的Webhook地址', trigger: 'change' }
                    ]">
                  <el-input v-model="form.webhookUrl" :disabled="form.workWechatSwitch === 0" style="width: 350px;" size="mini" placeholder="请输入Webhook地址"></el-input>
                </el-form-item>
              </div>
              <el-button type="primary" size="medium" :loading="testTheConnectionLoading" style="padding: 6px 12px;" @click="testTheConnection" :disabled="form.workWechatSwitch === 0">测试推送</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item style="margin: 0 0 0 162px;">
          <el-button @click="updateWarnConf" size="medium" type="primary">保存</el-button>
          <el-button size="medium" @click="resetWarnConf">重置</el-button>
        </el-form-item>
      </el-form>
    </panel>
  </div>
</template>

<script>
import { getWarnConf, updateWarnConf, resetWarnConf, masterSwitch, testWorkWechatSend } from '@/api/home/message'
import { validateUrl } from '@/utils/validate'
import to from '@/utils/await-to'

export default {
  name: 'risk',
  data () {
    return {
      loading: false,
      testTheConnectionLoading: false,
      images: [
        require('@/assets/images/webhook-1.png'),
        require('@/assets/images/webhook-2.png'),
        require('@/assets/images/webhook-3.png'),
        require('@/assets/images/webhook-4.png')
      ],
      rules: {},
      form: {
        componentNoticeLevelList: [],
        licenseNoticeLevelList: [],
        mailNoticeSwitch: 0,
        noticeTimeList: [],
        riskMonitoringSwitch: 0,
        vulNoticeLevelList: [],
        websiteNoticeSwitch: 0,
        workWechatSwitch: 0,
        webhookUrl: ''
      }
    }
  },
  methods: {
    validateUrl (rule, value, callback) {
      if (value) {
        if (validateUrl(value)) {
          callback()
        } else {
          callback(new Error())
        }
      } else {
        callback()
      }
    },
    async testTheConnection () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.testTheConnectionLoading = true
          const [error] = await to(testWorkWechatSend({ webhookUrl: this.form.webhookUrl, loading: false }))
          this.testTheConnectionLoading = false
          if (error && error.message) {
            this.$message.error(error.message)
          } else {
            this.$message.success('推送成功')
          }
        } else {
          return false
        }
      })
    },

    openConfStep () {
      this.$popup({
        title: '配置步骤：企业微信',
        showConfirmButton: false,
        cancelButtonText: '我知道了',
        width: '800px',
        center: true,
        content:
          `<div style="padding: 20px;">
               <p>1. 在企业微信的群聊中添加机器人，打开要接收消息通知的群聊，进入【聊天信息】后，点击【添加群机器人】</p>
               <img class="m-b-20" src="${this.images[0]}" width="90%" style="border: 1px solid #2C5F8A;border-radius: 3px;display: block;">
               <p>2. 点击【新创建一个机器人】</p>
               <img class="m-b-20" src="${this.images[1]}" width="90%" style="border: 1px solid #2C5F8A;border-radius: 3px;display: block;">
                <p>3. 输入机器人名称、选择头像（可选）后，点击【添加机器人】按钮</p>
               <img class="m-b-20" src="${this.images[2]}" width="90%" style="border: 1px solid #2C5F8A;border-radius: 3px;display: block;">
                <p>4. 点击【复制地址】，将复制的Webhook地址配置到平台的Webhook地址中，可点击【测试推送】按钮推送测试消息到企微群聊，若企微群聊中接收到平台的测试推送消息，则配置成功</p>
               <img src="${this.images[3]}" width="90%" style="border: 1px solid #2C5F8A;border-radius: 3px;display: block;">
          </div>`
      })
    },
    // 更新默认配置
    updateWarnConf () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          updateWarnConf(this.form).then((response) => {
            this.$message.success('操作成功')
            this.initWarnConf()
          }).catch(error => {
            if (typeof error === 'object') {
              this.$message.error(error.message)
            }
          })
        } else {
          return false
        }
      })
    },

    // 总开关
    masterSwitch () {
      masterSwitch({
        riskMonitoringSwitch: this.form.riskMonitoringSwitch
      }).then((response) => {
        this.$message.success('操作成功')
        this.initWarnConf()
      }).catch(error => {
        this.initWarnConf()
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 重置
    resetWarnConf () {
      resetWarnConf({
        ...this.form
      }).then(async (response) => {
        this.$message.success('操作成功')
        await this.initWarnConf()
        this.$refs.ruleForm.resetFields()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 初始默认配置
    async initWarnConf () {
      this.loading = true
      await getWarnConf({
        loading: false
      }).then((response) => {
        this.loading = false
        const data = response.data
        this.form = {
          ...this.$options.data().form,
          ...data
        }
        Object.keys(data).forEach(k => {
          this.form[k] = data[k]
        })
        if (this.form.workWechatSwitch === 0 && this.form.webhookUrl === '') {
          this.$nextTick(() => {
            this.$refs.ruleForm.resetFields()
          })
        }
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    this.initWarnConf()
  }
}
</script>

<style scoped lang="scss">
.all-disabled .el-form-item__label {
  color: rgb(220, 222, 224);
}

.el-checkbox {
  margin: 0 30px;
}

.card-box {
  border-radius: 4px;
  background: rgb(255, 255, 255);
  box-shadow: 0 2px 8px 0 rgba(43, 117, 183, 15%);
  padding: 15px 20px;
  line-height: 24px;
  box-sizing: border-box;
  max-width:820px;
  overflow: hidden;

}
.close-el-form-item__label {
  :deep(.el-form-item__label) {
    display: none !important;
  }

  :deep(.el-form-item.is-error) {
    margin-bottom: 10px !important;
  }
}
</style>
