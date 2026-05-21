<template>
  <el-dialog
    width="900px"
    :title="mode === 'edit' ? '编辑报告模版' : (mode === 'view' ? '查看报告模版' : '添加报告模版')"
    class="dialog-vertical-center"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @opened="opened"
    @closed="onClosed"
  >
    <div style="padding: 30px 75px">
      <el-form ref="form" :model="formData" label-width="100px" :rules="rules" size="small" label-position="right"
        :disabled="mode === 'view'"
      >
        <el-form-item label="模版名称：" prop="name">
          <el-input class="input" clearable v-model="formData.name" placeholder="请输入模版名称"></el-input>
        </el-form-item>
        <el-form-item label="所属模块：" prop="moduleCode" >
          <el-radio-group
            style="margin-top: 10px"
            v-model="formData.moduleCode"
            @change="onChangeModuleCode"
          >
            <el-radio
              v-for="item in moduleOptions"
              :key="item.value"
              :label="item.value"
              style="margin-bottom: 10px"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报告内容：" prop="content" style="margin-bottom: 25px">
          <check-report-content
            :moduleCode="formData.moduleCode"
            :defaultTreeData="defaultTreeData"
            :mode="mode"
            ref="checkReportContent"
          />
        </el-form-item>
        <el-form-item prop="note" label="备注：" style="margin-bottom: 0px">
          <el-input
            class="w-full"
            type="textarea"
            placeholder="请输入备注"
            :maxlength="200"
            v-model="formData.note"
            :rows="3"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="mode === 'view'">
      <el-button style="width: 80px" type="primary" @click="cancel" size="medium">确定</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-else>
      <el-button style="width: 80px" type="primary" @click="confirm" size="medium">确定</el-button>
      <el-button style="width: 80px" @click="cancel" size="medium">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { templateModules, templateDetails, addTemplate, updateTemplate } from '@/api/home/report/template'
import CheckReportContent from './checkReportContent'
import { noop } from 'lodash-es'

export default {
  name: 'dialogAddAndEditTemplate',
  components: { CheckReportContent },
  props: {
    done: {
      type: Function,
      default () {
        return noop
      }
    },
    closed: {
      type: Function,
      default () {
        return noop
      }
    }
  },
  data () {
    const validator = (rule, value, callback) => {
      if (value) {
        if (/^((?![/\\:*?"'<>!！\s]).){2,60}$/g.test(value)) {
          callback()
        } else {
          return callback(new Error('模板名称字符长度为2-60个字符，且不能包含 /\\:*?"\'<>! 空格任何字符'))
        }
      } else {
        return callback(new Error('请输入模板名称'))
      }
    }
    return {
      mode: 'add',
      visible: false,
      loading: false,
      id: undefined,
      rules: {
        name: [
          {
            required: true,
            validator: validator,
            trigger: 'change'
          }
        ],
        moduleCode: [
          {
            required: true,
            message: '请选择所属模块',
            trigger: 'change'
          }
        ]
      },
      formData: {
        name: undefined,
        note: undefined,
        templateSwitches: [],
        moduleCode: 1
      },
      defaultTreeData: [],
      moduleOptions: []
    }
  },
  methods: {
    /**
     * 初始化所属模块
     * @returns {any}
     */
    initModules () {
      return templateModules({
        loading: false
      })
        .then(response => {
          this.moduleOptions = (response.data || []).map(item => ({
            label: item.description,
            value: item.code
          }))
        })
        .catch(error => {
          this.tableData = []
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    initFormData () {
      return templateDetails({
        loading: true,
        templateId: this.id
      })
        .then(response => {
          this.formData = {
            ...this.formData,
            ...response.data
          }

          const { templateSwitches = [] } = response.data
          const checkedKeys = []
          this.defaultTreeData = templateSwitches
          templateSwitches.forEach(item => {
            (item.children || []).forEach(itemm => {
              if (itemm.enable) {
                checkedKeys.push(item.key + '_' + itemm.key)
              }
            })
          })

          this.$refs.checkReportContent.setCheckedKeys(checkedKeys)
        })
        .catch(error => {
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    onChangeModuleCode (value) {
      this.defaultTreeData = []
      this.formData.moduleCode = value
    },

    use (mode = 'add', row = null) {
      this.visible = true
      this.mode = mode
      if (row) {
        this.id = row.id
      }
    },
    async opened () {
      if (this.mode === 'edit' || this.mode === 'view') {
        Promise.all([
          this.initModules()
        ]).then(() => {
          this.initFormData()
        })
      } else {
        this.initModules()
      }
    },
    onClosed () {
      this.id = null
      this.formData = {
        name: undefined,
        note: undefined,
        moduleCode: 1
      }
      this.$refs.form.resetFields()
      this.closed()
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.id) {
            this.editTemplate()
          } else {
            this.addTemplate()
          }
        } else {
          return false
        }
      })
    },
    editTemplate () {
      updateTemplate(
        {
          templateId: this.id,
          ...this.formData,
          templateSwitches: this.$refs.checkReportContent.getCheckedTreeNodes()
        }).then(() => {
        this.cancel()
        this.done()
        this.$message.success('操作成功')
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    addTemplate () {
      addTemplate(
        {
          ...this.formData,
          templateSwitches: this.$refs.checkReportContent.getCheckedTreeNodes()
        }).then(() => {
        this.cancel()
        this.done()
        this.$message.success('操作成功')
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-textarea .el-input__count) {
  color: #333;
}
</style>
