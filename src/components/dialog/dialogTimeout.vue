<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div class="dialog-body">
      <h4>
        由于登录超时或账号已在其他设备登录
      </h4>
      <h4>
        当前账号将被强制登出！
      </h4>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="[confirm(), dialogVisible = false]" size="medium">继续登录</el-button>
      <el-button @click="[cancel(), dialogVisible = false]" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'DialogTimeout',
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
      this.cancel()
    },

    // 提交
    confirm () {},

    // 取消
    cancel () {},

    forceLogin () {
      return new Promise((resolve, reject) => {
        this.confirm = resolve
        this.cancel = reject
      })
    },

    // 打开窗口时的回调
    open () {}
  }
}
</script>

<style scoped lang="scss">
.dialog-body {
  text-align: center;

  h4 {
    font-size: 18px;
  }

  p {
    color: #666;
  }
}
</style>
