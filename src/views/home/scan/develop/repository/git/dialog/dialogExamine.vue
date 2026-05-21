<template>
  <el-dialog
    title="查看"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="900px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-form class="form-step-2 label-top-form" label-width="100px" size="medium" label-position="top">
      <el-form-item label="回调地址：">
        <el-col :span="23">
          <el-button size="mini" class="copy-btn" @click="copyText(echo.callbackUrl)">复制</el-button>
          <code class="code-container">{{ echo.callbackUrl || '-' }}</code>
        </el-col>
      </el-form-item>
      <el-form-item label="Token：">
        <el-col :span="23">
          <el-button size="mini" class="copy-btn" @click="copyText(echo.token)">复制</el-button>
          <code class="code-container">{{ echo.token || '-' }}</code>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="medium">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { copyText } from '@/utils'

export default {
  name: 'DialogGitConf',
  data () {
    return {
      dialogVisible: false,
      echo: {
        callbackUrl: '',
        token: ''
      }
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },

    // 取消
    cancel () {
      this.dialogVisible = false
    },

    // 复制文本
    copyText: copyText,

    open () {}
  }
}
</script>

<style scoped lang="scss">
  .el-form {
    padding: 0 40px;
  }

  .form-step-2 {
    padding: 0 40px;

    .copy-btn {
      float: right;
      margin-top: -32px;
    }
  }

  .op-btn {
    i {
      cursor: pointer;
      transition: all 0.6s;

      &:hover {
        color: #7C3AED;
      }

      &:active {
        color: #0760af;
      }
    }

    .el-icon-refresh {
      font-size: 18px;
    }
  }
</style>
