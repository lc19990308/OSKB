<template>
  <el-dialog
    title="生成报告"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    :close-on-click-modal="false"
    :destroy-on-close="true">
    <el-form :model="form" label-width="100px" :rules="rules" ref="form" size="medium" label-position="right" @submit.native.prevent>
<!--      <el-form-item label="报告名称：" prop="name">-->
<!--        <el-input v-model="form.name" placeholder="请输入报告名称" clearable></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="报告类型：" prop="type" style="margin-bottom: 0">
        <el-radio-group v-model="form.type">
          <el-radio v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-radio>
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
import { isArray } from '@/utils'
import { downloadHtml, downloadExcel } from '@/api/home/scan/integration/sourceCode'
export default {
  name: 'DialogExportReport',
  computed: {
    options () {
      return [
        {
          label: 'HTML',
          value: 'html'
        },
        {
          label: 'Excel',
          value: 'excel'
        }
      ]
    },
    isAll () {
      return isArray(this.row)
    }
  },
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
        taskId: undefined,
        type: 'html'
      },
      rules: {
        name: [
          { required: true, validator: validator, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 提交
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },
    useDialog (taskId) {
      this.form.taskId = taskId
      this.dialogVisible = true
    },
    submit () {
      if (this.form.type === 'html') {
        this.createHtmlReport()
      } else if (this.form.type === 'excel') {
        this.createExcelReport()
      }
    },
    message () {
      setTimeout(() => this.$popup({
        title: '提示',
        width: '550px',
        confirmButtonText: '去下载',
        cancelButtonText: '留在本页',
        underline: true,
        center: false,
        render (h) {
          return h('el-row', { class: 'font-base', style: { padding: 0 } }, [
            h('p', {}, [h('i', {
              class: 'el-icon-success text-success font-xxl m-r-5',
              style: { verticalAlign: 'bottom' }
            }, ''), '操作成功，请在报告管理中下载报告~'])
          ])
        },
        beforeClose: (action, next) => {
          if (action === 'confirm') {
            this.$router.push({ path: '/report/list' })
          }
          next()
        }
      }), 200)
    },

    // 生成应用包审查任务excel报告
    createExcelReport () {
      downloadExcel(this.form.taskId).then(() => {
        this.cancel()
        this.message()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    // 生成html报告
    createHtmlReport () {
      downloadHtml(this.form.taskId).then(() => {
        this.cancel()
        this.message()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 取消
    cancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    }
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
