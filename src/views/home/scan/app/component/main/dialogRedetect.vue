<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <el-form
      label-width="160px"
      size="medium"
      inline
      :disabled="readonly"
      label-position="right"
    >
      <el-row>
        <el-form-item prop="check" label="审查方式：">
        <span slot="label">
          <el-tooltip class="item" placement="top-start">
            <div style="width: 300px; line-height: 18px;" slot="content">
              快速审查：检测速度快。通过成分分析、依赖分析、特征分析、引用识别等技术精确识别应用内引入的开源组件的基本信息、已知漏洞、开源许可证等信息<br><br>
              深度审查：在快速审查的基础上进一步检测并分析开源组件的子依赖，检测速度较慢
            </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
        </span>
          <span slot="label">
          审查方式：
        </span>
          <el-radio v-model="checkType" :label="0">快速审查</el-radio>
          <el-radio v-model="checkType" :label="1">深度审查</el-radio>
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
        <el-form-item prop="cleanLevel" label="审查方式：" style="margin-bottom: 0;">
        <span slot="label">
          <el-tooltip class="item" placement="top">
            <div style="width: 300px; line-height: 18px;" slot="content">
                快速清洗：只清洗无效组件，结果包含项目中所有可能引入的组件<br>
                深度清洗：清洗重复声明和未使用的组件，结果只包含有可能直接影响项目安全的组件，推荐使用该选项
              </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
          <span>
            数据清洗：
          </span>
        </span>
          <el-radio-group v-model="cleanLevel">
            <!--          <el-radio :label="0">不做清洗</el-radio>-->
            <el-radio :label="1">快速清洗</el-radio>
            <el-radio :label="2">深度清洗</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="!readonly" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { isArray, isObject } from '@/utils'
import { addTask } from '@/api/home/public/app'

export default {
  name: 'DialogRedetect',
  data () {
    return {
      title: '审查',
      deepApply: 0,
      checkType: 0,
      cleanLevel: 2,
      taskId: null,
      dialogVisible: false,
      readonly: false,
      form: {
        deepLimit: 5
      }
    }
  },
  methods: {
    // 提交
    confirm () {
      this.submit()
    },

    submit () {
      const params = {
        appPackageIds: this.taskId,
        checkType: this.checkType,
        cleanLevel: this.cleanLevel
      }
      this.deepApply === 1 && (params.deepLimit = this.form.deepLimit)
      addTask(params).then(response => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        setTimeout(() => {
          this.$emit('callback')
        }, 500)
        this.cancel()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 取消
    cancel () {
      this.dialogVisible = false
    },

    open (row, readonly) {
      this.type = 1
      this.readonly = !!readonly
      this.dialogVisible = true
      this.title = readonly ? '检测规则' : (isObject(row) && [2, 3, 8].includes(row.status)) ? '重审' : '审查'
      if (isArray(row)) {
        this.taskId = row.map(x => x.appPackageId)
        this.form.deepLimit = 5
        this.form.source = 0
        this.deepApply = 0
      } else if (isObject(row)) {
        this.taskId = [row.appPackageId]
        this.form.deepLimit = row.deepLimit ? row.deepLimit : 5
        this.form.source = row.source ? row.source : 0
        this.checkType = row.checkType ? row.checkType : 0
        this.cleanLevel = row.cleanLevel || 2
        this.deepApply = row.deepLimit
          ? row.deepLimit > -1
            ? 1
            : 0
          : 0
      }
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
