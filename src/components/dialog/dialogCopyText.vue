<template>
  <el-dialog
    title="复制"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <div class="wrapper">
      <el-input size="medium" v-model="text" ref="input" readonly></el-input>
      <p>请选择文本进行复制</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="medium">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import eventBus from '@/utils/bus.js'
export default {
  name: 'dialogCopyText',
  data () {
    return {
      text: '',
      dialogVisible: false
    }
  },
  methods: {
    confirm () {
      this.dialogVisible = false
    },
    open () {
      this.$nextTick(() => {
        this.$refs.input.focus()
        this.$refs.input.select()
      })
    },
    handleClose (done) {
      done()
    }
  },
  mounted () {
    eventBus.$on('openDialogCopyText', (text) => {
      this.text = text
      this.dialogVisible = true
    })
  },
  destroyed () {
    eventBus.$off('openDialogCopyText')
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  padding: 30px;

  p {
    color: #666;
    font-size: 13px;
    margin: 10px 0 0;
  }
}
</style>
