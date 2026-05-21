<template>
  <el-dialog
    title="生成报告"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-form :model="form" label-width="100px" :rules="rules" ref="form" size="medium" label-position="right" @submit.native.prevent>
      <el-form-item label="报告名称：" prop="name">
        <el-input v-model="form.name" clearable placeholder="请输入报告名称"></el-input>
      </el-form-item>
      <el-form-item label="报告类型：" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="'word'">Word</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createWordReport } from '@/api/home/search'
import { downloadBlobFile } from '@/utils'

export default {
  name: 'DialogGenerateReport',
  data () {
    const validator = (rule, value, callback) => {
      if (value) {
        if (/^((?![/\\:*?"'<>!！\s]).){1,30}$/g.test(value)) {
          callback()
        } else {
          return callback(new Error('名称不可超过30个字符，且不能包含 \\ /:*?"<>! 任何字符'))
        }
      } else {
        return callback(new Error('请输入报告名称'))
      }
    }
    return {
      dialogVisible: false,
      passwordError: false,
      row: {},
      form: {
        name: '',
        type: 'word'
      },
      rules: {
        name: [
          { required: true, validator: validator, trigger: 'change' }
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createWordReport()
        } else {
          return false
        }
      })
    },

    // 生成word报告
    async createWordReport () {
      try {
        const result = await createWordReport({
          filename: this.form.name,
          id: this.row.id,
          packageManager: this.row.packageManager
        })
        await downloadBlobFile(result)
        this.cancel()
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // 取消
    cancel () {
      this.$refs.form.resetFields()
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

  .el-radio-group .el-radio {
    width: 65px;
    line-height: 34px;
  }
}
</style>
