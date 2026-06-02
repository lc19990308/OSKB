<template>
  <el-dialog
    title="Webhook配置"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="700px"
    @open="open"
    @close="handleClose"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true">
    <!-- <el-row :style="{marginBottom:'15px'}">
      <el-col :span="6">
        <el-tooltip class="item" placement="top">
          <div style="line-height: 18px; white-space:pre-wrap;" slot="content">
            {{`需将Webhook URL及Secret Token信息配置到Git仓库的Webhook配置中，\n 平台检测到仓库内代码更新时，会自动进行检测。\n 注：Webhook仅对选择的检测分支有效。`}}
          </div>
          <i class="iconfont iconbangzhu"></i>
        </el-tooltip>
        <span>Webhook配置：</span>
      </el-col>
      <el-col :span="18">
        <el-switch :active-value="1" :inactive-value="0" v-model="webhookState" @change="webhookChange"></el-switch>
      </el-col>
    </el-row>
    <el-row :style="{marginBottom:'15px'}" type="flex">
      <el-col :span="6">Webhook URL：</el-col>
      <el-col :span="18" class="copy-content">
        <el-tooltip class="item" effect="dark" :content="webhookUrl" placement="top">
          <span class="ellipsis">{{webhookUrl}}</span>
        </el-tooltip>
        <span class="copy-button" @click="copyUrl">复制</span>
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="6">Secret Token：</el-col>
      <el-col :span="18" class="copy-content">
        <el-tooltip class="item" effect="dark" :content="token" placement="top">
            <span class="ellipsis">{{token}}</span>
        </el-tooltip>
        <span class="copy-button" @click="copyToken">复制</span>
      </el-col>
    </el-row> -->
    <el-row :style="{marginBottom:'15px'}" type="flex">
      <el-col :span="4">SSH公钥：</el-col>
      <el-col :span="20">
        <div class="ssh-tips">请复制并将下方SSH公钥添加到您代码仓库的公钥管理中</div>
        <div class="copy-content">
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content" class="tooltip-ellipsis">{{publicKey}}</div>
            <span class="ellipsis">{{publicKey}}</span>
          </el-tooltip>
          <span class="copy-button" @click="copyPublicKey">复制</span>
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="medium" class="w-100 m-r-20">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { copyText } from '@/utils'
import { geWebhookConfig, switchWebhook, geSshPublic } from '@/api/home/scan/develop/repository/git'
export default {
  name: 'DialogInvestigate',
  data () {
    return {
      dialogVisible: false,
      id: null,
      webhookState: 0,
      token: '',
      webhookUrl: '',
      publicKey: ''
    }
  },
  methods: {
    // 打开
    open () {
      // this.getWebhook()
      this.geSshPublic()
    },
    // 关闭窗口
    handleClose () {
    },
    // 取消
    cancel () {
      this.dialogVisible = false
    },
    copyUrl () {
      copyText(this.webhookUrl)
    },
    copyToken () {
      copyText(this.token)
    },
    copyPublicKey () {
      copyText(this.publicKey)
    },

    getWebhook () {
      geWebhookConfig(this.id).then(response => {
        const data = response.data
        this.webhookState = data.open
        this.token = data.token
        this.webhookUrl = data.webhookUrl
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    geSshPublic () {
      geSshPublic().then(response => {
        this.publicKey = response.data
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    webhookChange (value) {
      switchWebhook({
        repositoryId: this.id,
        open: this.webhookState
      }).then(response => {
        if (response.code === 0) {
          this.$message.success('修改成功')
        }
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
.copy-content {
  color: #999;
  background-color: #eff3f6;
  height: 34px;
  line-height: 34px;
  padding: 0 15px;
  border-radius: 3px;
  border: 1px solid #dcdee0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copy-button {
  border-radius: 2px;
  color: #666;
  background: rgb(255, 255, 255);
  width: 42px;
  height: 23px;
  box-sizing: border-box;
  line-height: 23px;
  text-align: center;
  cursor: pointer;
}

.ellipsis {
  max-width: 85%;
}

.tooltip-ellipsis {
  max-width: 500px;
}

.ssh-tips {
  color: #D9534F;
  margin-bottom: 10px;
}
</style>
