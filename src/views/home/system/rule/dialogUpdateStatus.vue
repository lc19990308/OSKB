-<template>
  <el-dialog
    title="更改状态"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="600px"
    @open="open"
    :before-close="handleClose">
    <div class="wrapper">
      <el-radio-group v-model="effective">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'dialogChangeEffective',
  data () {
    return {
      dialogVisible: false,
      effective: 1
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },
    callback () {

    },
    // 取消
    cancel () {
      this.dialogVisible = false
    },

    // 提交
    confirm () {
      this.callback(this.effective)
      this.dialogVisible = false
    },

    // 打开窗口时的回调
    open () {
      // this.effective = 1
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  padding: 20px 0 20px 70px;
}
</style>
