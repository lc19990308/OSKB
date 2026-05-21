<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :show-close="showClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    modal-append-to-body
    :class="{'dialog-vertical-center': center, 'dialog-underline': underline}"
    @closed="closed"
    :before-close="cancel"
    append-to-body>
    <slot>
      <div v-html="content"></div>
    </slot>
    <template slot="footer">
      <slot name="footer">
        <el-button type="primary" style="min-width: 70px;font-weight: normal" v-if="showConfirmButton" :loading="loading" @click="confirm" size="medium">{{confirmButtonText}}</el-button>
        <el-button @click="cancel(null)" style="min-width: 70px; font-weight: normal" plain size="medium" v-if="showCancelButton">{{cancelButtonText}}</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
import { noop } from '@/utils'
export default {
  name: 'popup',
  data () {
    return {
      title: '提示',
      width: '500px',
      showClose: true,
      showCancelButton: true,
      showConfirmButton: true,
      content: null,
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      dialogVisible: false,
      beforeClose: null,
      loading: false,
      action: 'cancel',
      center: false,
      underline: false,
      onClose: noop
    }
  },
  methods: {
    closed(){
      this.loading = false
      document.body.removeChild(this.$el)
      this.$destroy()
    },
    close(done){
      this.dialogVisible = false
      typeof done === 'function' && done()
      this.onClose(this)
    },
    handleClose(done){
      if (typeof this.beforeClose === 'function'){
        this.beforeClose(this.action, ()=> {
          this.close(done)
        })
      }else {
        this.close()
      }
    },
    cancel(done){
      this.action = done ? 'done' : 'cancel'
      this.handleClose(done)
    },
    confirm () {
      this.action = 'confirm'
      this.loading = true;
      this.handleClose()
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-underline {
  :deep(.el-dialog) {
    .el-dialog__header {
      border-bottom: none !important;
    }
    .el-dialog__footer {
      border-top: none !important;
    }
  }
}
</style>
