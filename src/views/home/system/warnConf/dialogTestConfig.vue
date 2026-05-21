<template>
  <el-dialog
    title="测试配置"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="600px"
    @open="open"
    :before-close="handleClose">
    <el-form :model="form" label-width="120px" :rules="rules" ref="testConfig" size="medium" label-position="right">
      <el-form-item label="邮件标题：" prop="title">
        <el-input v-model="form.title" placeholder="邮件标题"></el-input>
      </el-form-item>
      <el-form-item label="内容模板：" prop="contentTemplate">
        <el-input type="textarea" :rows="5" v-model="form.contentTemplate" placeholder="内容模板"></el-input>
      </el-form-item>
      <el-form-item label="接收者邮箱：" prop="receiverMailList" class="pos-rel required">
        <el-input type="text" :rows="5" v-model="form.receiverMailList[0]" placeholder="请输入邮箱"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateEmail } from '@/utils/validate'
import { testEmailConfig } from '@/api/home/system/warnConf'
export default {
  name: 'DialogTestConfig',
  data () {
    const checkEmail = (rule, value, callback) => {
      if (value) {
        if (value.some(item => { return !validateEmail(item) })) {
          callback(new Error('邮箱格式错误！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      loading: false,
      collapseStatus: false,
      dialogVisible: false,
      form: {
        title: '',
        contentTemplate: '',
        receiverMailList: []
      },
      rules: {
        title: [
          { required: true, message: '请输入邮件标题', trigger: 'change' }
        ],
        receiverMailList: [
          { required: true, message: '请输入或选择接收者邮箱', trigger: ['blur', 'change'] },
          { validator: checkEmail, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        contentTemplate: [
          { required: true, message: '请输入内容模板', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      this.$refs.testConfig.resetFields()
      done()
    },

    // 提交
    confirm () {
      this.$refs.testConfig.validate((valid) => {
        if (valid) {
          testEmailConfig({
            ...this.form
          }).then(response => {
            this.$message.success('测试成功')
            this.dialogVisible = false
            this.$refs.testConfig.resetFields()
          }).catch(error => {
            if (error.message) {
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
      this.$refs.testConfig.resetFields()
      this.dialogVisible = false
    },

    // 打开窗口时的回调
    open () {
      this.checkedEmailList = []
      this.form = {
        title: '',
        contentTemplate: '',
        receiverMailList: []
      }
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss">
.el-form {
  padding: 15px 97px 0 40px;
}

.dialog-footer {
  height: 70px !important;
}
</style>
