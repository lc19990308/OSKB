<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    @close="handleClose"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true">
    <el-form ref="form" inline :model="form" class="form-step-2 label-top-form" label-width="120px" size="medium">
      <el-row>
        <el-form-item prop="checkType" label="审查方式：">
        <span slot="label">
          <el-tooltip class="item" placement="top">
            <div style="width: 300px; line-height: 18px;" slot="content">
              快速审查：检测速度快。通过成分分析、依赖分析、特征分析、引用识别等技术精确识别应用内引入的开源组件的基本信息、已知漏洞、开源许可证等信息<br><br>
              深度审查：在快速审查的基础上进一步检测并分析开源组件的子依赖，检测速度较慢
            </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
           审查方式：
        </span>
          <el-radio v-model="form.checkType" :label="0">快速审查</el-radio>
          <el-radio v-model="form.checkType" :label="1">深度审查</el-radio>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="checkType" label="解析深度：">
        <span slot="label">
          <el-tooltip class="item" placement="top">
            <div style="width: 300px; line-height: 18px;" slot="content">
              组件依赖解析深度：可自定义组件依赖的解析深度。<br><br>
              选择默认时，平台会默认根据组件的实际依赖层级进行检测；选择自定义时，用户可根据实际需求设置组件依赖检测层级（1-100层，默认检测5层）。
            </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
           解析深度：
        </span>
          <el-select class="w-210" v-model="deepApply" @change="form.deepLimit = 5" placeholder="活动区域">
            <el-option label="默认（组件实际依赖层级）" :value="0"></el-option>
            <el-option label="自定义" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label=""
          prop="deepLimit"
          v-if="deepApply === 1">
          <el-input-number class="w-100" v-model="form.deepLimit" @change="numberChange" controls-position="right" :min="1" :max="100" placeholder="自定义"></el-input-number>
          层
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="cleanLevel" label="数据清洗：">
        <span slot="label">
          <el-tooltip class="item" placement="top">
            <div style="width: 300px; line-height: 18px;" slot="content">
              快速清洗：只清洗无效组件，结果包含项目中所有可能引入的组件<br>
              深度清洗：清洗重复声明和未使用的组件，结果只包含有可能直接影响项目安全的组件，推荐使用该选项
              </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
            数据清洗：
        </span>
          <el-radio-group v-model="form.cleanLevel">
            <el-radio :label="1">快速清洗</el-radio>
            <el-radio :label="2">深度清洗</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
<!--      <el-row>-->
<!--        <el-form-item prop="cleanLevel" label="代码溯源分析：">-->
<!--        <span slot="label">-->
<!--          <el-tooltip class="item" placement="top">-->
<!--            <div style="width: 300px; line-height: 18px;" slot="content">-->
<!--             源代码溯源检测分析，通过SCA分层多源指纹分析、相似哈希精准匹配等关键技术对源代码进行深度的扫描分析，从代码层面识别出引用的开源项目的来源，定位代码中的漏洞及许可证合规风险。<br><br>-->
<!--             该规则开启后会对检测速度有一定影响。-->
<!--              </div>-->
<!--            <i class="iconfont iconbangzhu"></i>-->
<!--          </el-tooltip>-->
<!--            代码溯源分析：-->
<!--        </span>-->
<!--          <el-switch-->
<!--            :active-value="1"-->
<!--            :inactive-value="0"-->
<!--            v-model="form.source"-->
<!--          >-->
<!--          </el-switch>-->
<!--        </el-form-item>-->
<!--      </el-row>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onsubmit('form')" type="primary" size="medium" class="w-100">确 定</el-button>
      <el-button @click="cancel" size="medium" class="w-100 m-r-20">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isArray } from '@/utils'
import { gitRepositoryReDetectBatch } from '@/api/home/scan/develop/repository/git'

export default {
  name: 'DialogInvestigate',
  data () {
    return {
      dialogVisible: false,
      project: this.$store.state.home.project,
      title: '重审',
      state: {},
      deepApply: 0,
      form: {
        checkType: 0,
        cleanLevel: 2,
        deepLimit: 5,
        // source: 0,
        checkInfoList: []
      }
    }
  },
  methods: {
    /**
     * @name 批量或者单条审查入口函数
     * @param {Object || Array} state
     * @return void
     */
    useDialog (state = [], multiple, sourceOptions) {
      state = isArray(state) ? state : new Array(state)
      if (state.every(item => [2, 4, 5, 6, 7].includes(item.status))) {
        this.title = multiple ? '批量重审' : '重审'
        this.form.checkInfoList = state.map(item => ({
          gitRepositoryConfigId: item.gitRepositoryConfigId,
          gitRepositoryId: item.id,
          projectId: item.projectId,
          gitServerType: (sourceOptions ?? []).filter(item1 => item1.text === item.gitServerType)[0]?.value
        }))
        if (multiple) {
          // this.form.source = 0
          this.form.checkType = 0
          this.form.deepLimit = 5
          this.form.cleanLevel = 2
          this.deepApply = 0
        } else {
          // this.form.source = state[0].source
          this.form.checkType = state[0].checkType
          this.form.deepLimit = state[0].deepLimit
          this.form.cleanLevel = state[0].cleanLevel || 2
          this.deepApply = state[0].deepLimit > -1 ? 1 : 0
        }
        this.open()
      } else {
        this.$message({
          message: '不可选择正在检测中的仓库，请重新选择！'
        })
      }
    },
    // 提交
    onsubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            checkType: this.form.checkType,
            cleanLevel: this.form.cleanLevel,
            // source: this.form.source,
            checkInfoList: this.form.checkInfoList
          }
          this.deepApply === 1 && (params.deepLimit = this.form.deepLimit)
          gitRepositoryReDetectBatch(params).then(response => {
            this.$message.success('操作成功！')
            this.$emit('callback')
            this.cancel()
          }).catch(error => {
            if (error) {
              this.$message.error(error.message)
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 打开
    open () {
      this.dialogVisible = true
    },
    // 关闭窗口
    handleClose () {
      this.resetForm('form')
    },
    // 取消
    cancel () {
      this.dialogVisible = false
    },
    /**
     * @desc 防止传入空值
     * @param numValue
     */
    numberChange (numValue) {
      if (typeof numValue === 'undefined') {
        this.$nextTick(() => {
          this.form.deepLimit = 1
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-form {
  padding: 0 40px 0 30px;

  //::v-deep .el-form-item__label{
  //  margin-right: 10px;
  //}
}
</style>
