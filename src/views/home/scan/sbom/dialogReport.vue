<template>
  <el-dialog
    title="生成报告"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    :close-on-click-modal="false"
    :destroy-on-close="true">
    <el-form :model="form" label-width="100px" :rules="rules" ref="form" size="medium" label-position="right" @submit.native.prevent>
      <el-form-item v-if="!isAll" label="报告名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入报告名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="报告类型：" prop="type" style="margin-bottom: 0;">
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
import {
  createWordReport,
  createJsonReport,
  createHtmlReport,
  createPdfReport
} from '@/api/home/report'

import { createExcelReport } from '@/api/home/scan/sbom'
import { isArray } from '@/utils'

export default {
  name: 'DialogReport',
  computed: {
    options () {
      return [
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
        if (/^((?![/\\:*?"'<>!！\s]).)*$/g.test(value)) {
          callback()
        } else {
          return callback(new Error('不能包含 \\ /:*?"<>! 等特殊字符'))
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
        name: null,
        type: 'excel',
        dimensionality: 0
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

    submit () {
      if (this.form.type === 'word') {
        this.createWordReport()
      } else if (this.form.type === 'json') {
        this.createJsonReport()
      } else if (this.form.type === 'html') {
        this.createHtmlReport()
      } else if (this.form.type === 'pdf') {
        this.createPdfReport()
      } else if (this.form.type === 'excel') {
        this.createExcelReport()
      }
    },

    // 生成pdf报告
    createPdfReport () {
      createPdfReport({
        ...(!this.isAll && { reportName: this.form.name }),
        projectId: this.projectMixin.id,
        dimensionality: this.form.dimensionality,
        appPackageIds: isArray(this.row) ? this.row.map(row => row.id) : [this.row.id]
      }).then(() => {
        this.cancel()
        this.message()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 生成word报告
    createWordReport () {
      createWordReport({
        ...(!this.isAll && { reportName: this.form.name }),
        projectId: this.projectMixin.id,
        appPackageIds: isArray(this.row) ? this.row.map(row => row.appPackageId) : [this.row.appPackageId]
      }).then(() => {
        this.cancel()
        this.message()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    message () {
      setTimeout(() => this.$popup({
        title: '提示',
        width: '550px',
        confirmButtonText: '去下载',
        cancelButtonText: '留在本页',
        center: false,
        render (h) {
          return h('el-row', { class: 'font-base', style: { padding: '20px' } }, [
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

    // 生成json报告
    createJsonReport () {
      createJsonReport({
        ...(!this.isAll && { reportName: this.form.name }),
        projectId: this.projectMixin.id,
        dimensionality: this.form.dimensionality,
        appPackageIds: isArray(this.row) ? this.row.map(row => row.appPackageId) : [this.row.appPackageId]
      }).then(() => {
        this.cancel()
        this.message()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 生成应用包审查任务excel报告
    createExcelReport () {
      createExcelReport({
        ...(!this.isAll && { reportName: this.form.name }),
        projectId: this.projectMixin.id,
        dimensionality: this.form.dimensionality,
        sbomPackageIds: isArray(this.row) ? this.row.map(row => row.id) : [this.row.id]
      }).then(() => {
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
      createHtmlReport({
        ...(!this.isAll && { reportName: this.form.name }),
        projectId: this.projectMixin.id,
        dimensionality: this.form.dimensionality,
        appPackageIds: isArray(this.row) ? this.row.map(row => row.appPackageId) : [this.row.appPackageId]
      }).then(() => {
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
