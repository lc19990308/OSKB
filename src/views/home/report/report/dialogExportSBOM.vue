<template>
  <el-dialog
    title="导出SBOM"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="900px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="handleClose">
    <el-alert :closable="false" type="primary" class="header-alert">
      SBOM（Software Bill of Materials，软件物料清单）是一个包含软件组件列表及组件依赖信息，且机器可读的规范性清单。它帮助透明化软件供应链资产，是软件供应链安全的重要组成部分。平台支持国际通用的SBOM标准格式的导出，包括：SPDX、CycloneDX、SWID。
    </el-alert>
    <el-form :model="form" label-width="100px" :rules="rules" ref="addProject" size="small" label-position="right">
      <el-form-item label="名称：" prop="reportName" v-if="!isBatch">
        <el-input class="input" clearable v-model="form.reportName" placeholder="请输入报告名称"></el-input>
      </el-form-item>
      <el-form-item label="标准：" prop="sbomType">
        <el-radio-group
          v-model="form.sbomType"
          @change="changeSbomType"
        >
          <el-radio
            v-for="item in sbomTypeOptions"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="格式：" prop="sbomFormat">
        <el-radio-group
          v-model="form.sbomFormat"
        >
          <el-radio
            v-for="item in sbomFormatOptions"
            v-show="showFormatOptions.includes(item.value)"
            :key="item.value"
            :label="item.value"
          >
            {{ form.sbomType === 1 ? item.SPDX_label : '' }}
            {{ form.sbomType === 2 ? item.CycloneDX_label : '' }}
            {{ form.sbomType === 3 ? item.SWID_label : '' }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium" :loading="loading">{{loading ? '导出中...' : '确 定'}}</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { downloadBlobFile } from '@/utils'
import axios from 'axios'
export default {
  name: 'DialogExportSBOM',
  data () {
    const validator = (rule, value, callback) => {
      if (value) {
        if (/^((?![/\\:*?"'<>!！\s]).){1,100}$/g.test(value)) {
          callback()
        } else {
          return callback(new Error('报告名称不可超过100个字符，且不能包含 /\\:*?"\'<>! 空格任何字符'))
        }
      } else {
        return callback(new Error('请输入报告名称'))
      }
    }
    return {
      id: '',
      isBatch: false,
      dialogVisible: false,
      loading: false,
      sbomFormatOptions: [
        {
          value: 4,
          SPDX_label: 'JSON(*.spdx.json)',
          CycloneDX_label: 'JSON(*.json)',
          SWID_label: 'JSON(*.json)'
        },
        {
          value: 6,
          SPDX_label: 'RDF(*.spdx.rdf)'
        },
        {
          value: 7,
          SPDX_label: 'tag:value(*.spdx)'
        },
        {
          value: 8,
          SPDX_label: 'XML(*.spdx.xml)',
          CycloneDX_label: 'XML(*.xml)',
          SWID_label: 'XML(*.xml)'
        },
        {
          value: 9,
          SPDX_label: 'YAML(*.spdx.yaml or *.spdx.yml)'
        },
        {
          value: 10,
          SPDX_label: 'cbor(*.cbor)',
          SWID_label: 'cbor(*.cbor)'
        }
      ],
      sbomTypeOptions: [
        {
          value: 1,
          label: 'SPDX',
          formats: [4, 6, 7, 8, 9]
        },
        {
          value: 2,
          label: 'CycloneDX',
          formats: [4, 8]
        },
        {
          value: 3,
          label: 'SWID',
          formats: [4, 8, 10]
        }
      ],
      form: {
        reportName: '',
        sbomType: 1,
        sbomFormat: 4
      },
      rules: {
        reportName: [
          { required: true, validator: validator, trigger: 'change' }
        ],
        sbomType: [
          { required: true, message: '请选择标准', trigger: 'change' }
        ],
        sbomFormat: [
          { required: true, message: '请选择格式', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    showFormatOptions () {
      let formats = []
      this.sbomTypeOptions.forEach(item => {
        if (item.value === this.form.sbomType) {
          formats = item.formats
        }
      })
      return formats
    }
  },
  methods: {
    // 关闭窗口
    handleClose (done) {
      done()
    },

    changeSbomType () {
      this.$set(this.form, 'sbomFormat', this.showFormatOptions[0])
    },

    xhr () {
      return new Promise()
    },

    async submit () {
      try {
        this.loading = true
        this.messageBox = this.$message({
          dangerouslyUseHTMLString: true,
          customClass: 'loading-message-box',
          iconClass: 'el-icon-loading text-primary',
          duration: 0,
          message: '<span class="text-regular">导出中...</span>'
        })
        this.cancelToken = axios.CancelToken.source()
        const response = await this.xhr({
          ...this.form,
          loading: false
        }, {
          cancelToken: this.cancelToken.token
        })

        await downloadBlobFile(response)
        this.$refs.addProject.resetFields()
        this.messageBox.close()
        this.$message.success('导出成功')
        this.dialogVisible = false
      } catch (error) {
        this.messageBox.close()
        if (error && error.message) this.$message.error(error.message)
      } finally {
        this.loading = false
      }
    },

    // 提交
    confirm () {
      this.$refs.addProject.validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },

    // 取消
    cancel () {
      this.loading = false
      this.messageBox && this.messageBox.close()
      this.cancelToken && this.cancelToken.cancel('cancel')
      this.$refs.addProject.resetFields()
      this.dialogVisible = false
    },

    // 打开窗口时的回调
    open () {
      this.form = {
        reportName: undefined,
        sbomType: 1,
        sbomFormat: 4,
        ...this.form
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .el-form {
    .input {
      width: 350px;
    }
    .el-radio {
      line-height: 35px;
    }

    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 20px;
    }
  }
</style>
