<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @close="handleClose"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true">
    <div class="p-t-15 p-b-15 upload-warp">
      <el-upload
        class="upload-demo"
        drag
        action="/oss/api-v1/searcher/component/batchSearch/upload"
        :show-file-list="true"
        ref="upload"
        name="file"
        :headers="headers"
        :on-success="onSuccess"
        :on-error="onError"
        :auto-upload="false"
        multiple>
        <i class="el-icon-upload text-primary"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em><br>
          <span style="font-size: 13px">支持扩展名：.xls、.xlsx</span>
        </div>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" class="w-80" @click="$refs.upload.submit()">上 传</el-button>
      <el-button @click="cancel" size="medium" class="w-80">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'DialogInvestigate',
  data () {
    return {
      dialogVisible: false,
      project: this.$store.state.home.project,
      title: '上传文件',
      headers: { Authorization: `Bearer ${this.$store.state.login.accessToken}` },
      state: {}
    }
  },
  methods: {
    /**
     * @name 上传成功
     * @param e
     */
    onSuccess (e) {
      if (e.code === 0) {
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
        this.cancel()
      } else {
        this.$message.error(e.message)
      }
      this.$emit('callback')
      try {
        this.$refs.upload.clearFiles()
      } catch (e) {

      }
    },
    /**
     * @name 上传失败
     * @param error
     */
    onError (error) {
      this.$message.error(error.message)
    },
    /**
     * @name 入口函数
     * @param {Object || Array} state
     * @return void
     */
    useDialog () {
      this.open()
    },

    // 上传图片前的过滤
    beforeUploadHandler (file) {
      const has = file.name.match(/(.xlsx|.xls)/g)
      !has && this.$message.error('仅支持扩展名：.xls、.xlsx')
      return Boolean(has)
    },

    // 打开
    open () {
      this.dialogVisible = true
    },

    // 关闭窗口
    handleClose () {

    },

    // 取消
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-warp {
  width: 450px;
  margin: 0 auto;

  .upload-demo {
    .text-primary {
      color: $color-primary;
    }

    :deep(.el-upload-dragger) {
      width: 450px;
    }
  }
}

</style>
