<template>
  <div>
    <dialog-add-and-edit-template
      ref="dialogTemplate"
      :closed="createTemplateClosed"
      :done="createTemplateEnd"
    />
    <el-dialog
      title="生成报告"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="900px"
      class="dialog-vertical-center"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <el-form style="padding-top: 30px;" :model="form" label-width="100px" :rules="rules" ref="form" size="medium"
               label-position="right"
                @submit.native.prevent>
        <el-form-item label="报告名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入报告名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="报告格式：" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio v-for="item in typeOptions" :label="item.value" :key="item.value">{{item.text}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item  label="报告模板：">
          <el-row type="flex" justify="space-between">
            <el-col :span="21">
              <el-form-item  prop="templateId">
                <ScrollLoadSelect
                  ref="select_template"
                  v-model="form.templateId"
                  :moduleCode="moduleCode"
                  @change="onChangeTemplateId"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button
                type="text"
                @click="onClickCreateTemplate"
              >新建模板</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="报告内容：" prop="content" style="margin-bottom: 25px">
          <check-report-content
            :moduleCode="moduleCode"
            :defaultTreeData="templateData"
            :mode="form.templateId ? 'content' : 'add'"
            ref="checkReportContent"
          />
        </el-form-item>
        <el-form-item label="高级选项">
          <el-switch
            v-model="form.advancedOptions">
          </el-switch>
        </el-form-item>
        <template v-if="form.advancedOptions">
          <el-form-item label="组件筛选：" >
            <el-row type="flex" class="m-b-15">
              <el-col :span="12">
                <el-form-item  prop="componentSecurities">
                  <el-select multiple collapse-tags  v-model="form.componentSecurities" placeholder="请选择组件风险等级">
                    <el-option
                      v-for="item in levelOptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="m-l-10">
                <el-form-item  prop="componentDepths">
                  <el-select  multiple collapse-tags v-model="form.componentDepths" placeholder="请选择组件解析深度">
                    <el-option
                      v-for="item in deepApplyOpitons"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item  prop="componentBlackWhitelist">
                  <el-select v-model="form.componentBlackWhitelist" collapse-tags placeholder="请选择组件名单">
                    <el-option
                      v-for="item in componentListOpitons"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="m-l-10">
                <el-form-item  prop="componentUnmatchedBaseline">
                  <el-checkbox
                    v-model="form.componentUnmatchedBaseline"
                    :true-label="1"
                    :false-label="0"
                  >不符合版本基线的组件</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="漏洞筛选：" >
            <el-row  type="flex">
              <el-col :span="12">
                <el-form-item  prop="vulnerabilitySecurities">
                  <el-select multiple collapse-tags v-model="form.vulnerabilitySecurities" placeholder="请选择漏洞风险等级">
                    <el-option
                      v-for="item in vulLevelOptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="m-l-10">
                <el-form-item  prop="vulnerabilityBlackWhitelist">
                  <el-select v-model="form.vulnerabilityBlackWhitelist" placeholder="请选择漏洞名单">
                    <el-option
                      v-for="item in vulListOpitons"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="许可证筛选：">
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item  prop="licenseSecurities">
                  <el-select multiple collapse-tags v-model="form.licenseSecurities" placeholder="请选择许可证风险等级">
                    <el-option
                      v-for="item in licenseLevelOptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="m-l-10">
                <el-form-item  prop="licenseBlackWhitelist">
                  <el-select v-model="form.licenseBlackWhitelist" placeholder="请选择许可证名单">
                    <el-option
                      v-for="item in licenseListOpitons"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
        <el-button @click="cancel" size="medium">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createAppPackageReport,
  createBinaryReport,
  createFireflyReport,
  createGitReport,
  createIdeReport,
  createImageReport,
  createIntegrationReport,
  createRepositoryReport,
  createSbomReport,
  createSvnReport,
  createIastReport
} from '@/api/home/report'
import { templateDetails } from '@/api/home/report/template'
import CheckReportContent from '@/views/home/report/config/template/checkReportContent'
import dialogAddAndEditTemplate from '@/views/home/report/config/template/dialogAddAndEditTemplate'
import { isArray } from '@/utils'
import ScrollLoadSelect from './ScrollLoadSelect'
/**
{code: 1, description: "组件依赖检测"}
{code: 2, description: "测试运行监控"}
{code: 3, description: "Git代码库管理"}
{code: 4, description: "私服库安全扫描"}
{code: 5, description: "IDE开发管理"}
{code: 6, description: "SVN代码库管理"}
{code: 8, description: "二进制成分分析"}
{code: 11, description: "集成部署"}
{code: 12, description: "Firefly代码库管理"}
{code: 14, description: "SBOM风险扫描"}
{code: 15, description: "镜像安全扫描"}
 */

export default {
  name: 'DialogCreateReport',
  components: { CheckReportContent, dialogAddAndEditTemplate, ScrollLoadSelect },
  props: {
    moduleCode: {
      type: [Number, String],
      default: 1
    }
  },
  computed: {
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
      loading: false,
      templateOptionsLoading: false,
      row: {},
      ids: [],
      templateData: [],
      form: {
        name: '',
        type: 1,
        templateId: null,
        advancedOptions: false,
        componentBlackWhitelist: null,
        componentDepths: [],
        componentSecurities: [],
        componentUnmatchedBaseline: 0,
        licenseBlackWhitelist: null,
        licenseSecurities: [],
        vulnerabilityBlackWhitelist: null,
        vulnerabilitySecurities: []
      },
      typeOptions: [
        {
          value: 1,
          text: 'Word'
        },
        {
          value: 2,
          text: 'PDF'
        },
        {
          value: 3,
          text: 'Html'
        },
        {
          value: 4,
          text: 'Json'
        },
        {
          value: 5,
          text: 'Excel'
        }
      ],
      templateOptions: [],
      levelOptions: [
        {
          value: 1,
          text: '严重'
        },
        {
          value: 2,
          text: '高危'
        },
        {
          value: 3,
          text: '中危'
        },
        {
          value: 4,
          text: '低危'
        },
        {
          value: 5,
          text: '无漏洞'
        }
      ],
      vulLevelOptions: [
        {
          value: 1,
          text: '严重'
        },
        {
          value: 2,
          text: '高危'
        },
        {
          value: 3,
          text: '中危'
        },
        {
          value: 4,
          text: '低危'
        }
      ],
      deepApplyOpitons: [
        {
          value: 0,
          text: '0层'
        },
        {
          value: 1,
          text: '1层'
        },
        {
          value: 2,
          text: '2层'
        },
        {
          value: 3,
          text: '3层'
        },
        {
          value: 4,
          text: '4层'
        },
        {
          value: 5,
          text: '5层'
        }
      ],
      componentListOpitons: [
        {
          value: 1,
          text: '组件白名单'
        },
        {
          value: 2,
          text: '组件黑名单'
        }
      ],
      vulListOpitons: [
        {
          value: 2,
          text: '漏洞白名单'
        },
        {
          value: 1,
          text: '漏洞黑名单'
        }
      ],
      licenseListOpitons: [
        {
          value: 2,
          text: '许可证白名单'
        },
        {
          value: 1,
          text: '许可证黑名单'
        }
      ],
      licenseLevelOptions: [
        {
          value: 1,
          text: '高风险'
        },
        {
          value: 2,
          text: '中风险'
        },
        {
          value: 3,
          text: '低风险'
        }
      ],
      rules: {
        name: [
          { required: true, validator, trigger: 'change' }
        ]
      },
      inspireTree: [{
        key: 'all',
        name: '全选',
        disabled: false,
        fixed: false,
        children: []
      }],
      defaultReportContent: [],
      resetDefaultData: [],
      parentTreeId: [],
      echoData: []
    }
  },
  methods: {
    use (ids, extraParams = {}) {
      this.ids = ids
      this.extraParams = extraParams
      this.dialogVisible = true
    },
    // 取消
    cancel () {
      this.$refs.form.resetFields()
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    // 关闭窗口
    handleClose (done) {
      done()
    },

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
    createReport (params) {
      const createReportApi = {
        1: createAppPackageReport,
        2: createIastReport,
        3: createGitReport,
        4: createRepositoryReport,
        5: createIdeReport,
        6: createSvnReport,
        8: createBinaryReport,
        11: createIntegrationReport,
        12: createFireflyReport,
        14: createSbomReport,
        15: createImageReport
      }
      if (createReportApi[this.moduleCode]) {
        return createReportApi[this.moduleCode](params)
      }
      return createReportApi[1](params)
    },
    submit () {
      let params = {
        name: this.form.name,
        type: this.form.type,
        templateId: this.form.templateId,
        ids: this.ids,
        projectId: this.projectMixin.id,
        ...this.extraParams
      }
      if (!this.form.templateId) {
        params.templateSwitches = this.$refs.checkReportContent.getCheckedTreeNodes()
      }
      if (this.form.advancedOptions) {
        params = {
          ...params,
          ...this.form,
          componentUnmatchedBaseline: this.form.componentUnmatchedBaseline === 0 ? null : 1
        }
      }
      this.createReport(params).then(() => {
        this.cancel()
        this.message()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    onChangeTemplateId () {
      return templateDetails({
        loading: false,
        templateId: this.form.templateId
      })
        .then(response => {
          const { templateSwitches = [] } = response.data
          const checkedKeys = []
          templateSwitches.forEach(item => {
            (item.children || []).forEach(itemm => {
              if (itemm.enable) {
                checkedKeys.push(item.key + '_' + itemm.key)
              }
            })
          })
          this.templateData = templateSwitches
          this.$refs.checkReportContent.setCheckedKeys(checkedKeys)
        })
        .catch(error => {
          this.loading = false
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
    },
    onClickCreateTemplate () {
      this.dialogVisible = false
      this.$refs.dialogTemplate.use()
    },
    createTemplateClosed () {
      this.dialogVisible = true
    },
    createTemplateEnd () {
      this.dialogVisible = true
      this.$refs.select_template.refreshList()
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
    }

  }
}
</script>

<style scoped lang="scss">
.el-form {
  padding: 0 60px 0 55px;

  .el-radio-group .el-radio {
    width: 65px;
    line-height: 34px;
  }

  .el-input,
  .el-select {
    width: 100%;
  }
}

.report-center {
  display: flex;

  .form-data {
    flex: 1;
    height: 400px;
    overflow-y: auto;
    padding: 10px 0;
    box-sizing: border-box;
    border: 1px solid #dcdcdc;
  }

  .operating {
    width: 100px;
    position: relative;

    .el-button:nth-child(1) {
      position: absolute;
      left: 22px;
      top: 183px;
      margin: 0;
    }
  }

  .to-data {
    flex: 1;
    height: 400px;
    overflow-y: auto;
    padding: 10px 0;
    box-sizing: border-box;
    border: 1px solid #dcdcdc;

    ul {
      list-style-type: none;
      padding: 0 15px;
      margin: 0;

      li {
        margin: 8px 0;
        line-height: 24px;
      }
    }
  }
}
</style>
