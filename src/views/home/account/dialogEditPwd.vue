<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-form :model="form" label-width="100px" :rules="rules" ref="edit" size="medium" label-position="right">
      <el-form-item label="旧密码：" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请输入确认密码" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editPassword } from '@/api/home/user'

export default {
  name: 'DialogEditPwd',
  data () {
    const validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'change' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'change' }
        ],
        confirmPassword: [
          { validator: validatePwd, trigger: 'change' }
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
          editPassword({
            oldPassword: this.form.oldPassword,
            newPassword: this.form.newPassword
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
  padding: 0 130px 0 40px;
}
</style>
