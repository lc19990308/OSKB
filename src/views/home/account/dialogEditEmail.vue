<template>
  <el-dialog
    title="编辑邮箱"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-alert :closable="false" type="warning">
      <div class="alert-content">
        <i class="el-icon-warning"></i>
        为了保证能正常接收到监控告警通知，请填写您常用的邮箱地址
      </div>
    </el-alert>
    <el-form :model="form" label-width="100px" :rules="rules" ref="edit" size="medium" label-position="right">
      <el-form-item label="邮箱地址：" prop="email">
        <el-input v-model="form.email" placeholder="请输入您常用的邮箱地址" autocomplete="off"></el-input>
      </el-form-item>
      <el-input style="display: none;"></el-input>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateEmail } from '@/api/home/user'

export default {
  name: 'DialogEditPwd',
  data () {
    return {
      dialogVisible: false,
      form: {
        email: ''
      },
      rules: {
        email: [
          { required: true, message: '您输入的邮箱格式有误', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },

    // 提交
    confirm () {
      this.$refs.edit.validate((valid) => {
        if (valid) {
          updateEmail({
            newEmail: this.form.email
          }).then(response => {
            this.$message.success('操作成功！')
            this.dialogVisible = false
            this.$refs.edit.resetFields()
            this.$emit('callback')
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

    // 取消
    cancel () {
      this.$refs.edit.resetFields()
      this.dialogVisible = false
    },

    // 打开窗口时的回调
    open () {}
  }
}
</script>

<style scoped lang="scss">
.el-form {
  padding: 20px 130px 0 40px;
}

.alert-content {
  margin-bottom: 5px;

  .handle {
    position: absolute;
    right: 20px;
    top: 12px;
  }
}
</style>
