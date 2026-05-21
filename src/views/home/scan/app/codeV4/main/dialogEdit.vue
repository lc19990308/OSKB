<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="700px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <el-form
      label-width="120px"
      size="medium"
      ref="form"
      :model="form"
      :rules="rules"
      label-position="right"
      style="padding-right: 40px;"
    >
      <el-row>
        <el-form-item prop="name" label="应用名称：">
          <el-input
            clearable
            placeholder="请输入应用名称"
            v-model="form.name"
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="version" label="版本号：">
          <el-input
            clearable
            placeholder="请输入版本号"
            v-model="form.version"
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="description" label="应用描述：">
          <el-input
            class="input"
            type="textarea"
            placeholder="请输入应用描述"
            :maxlength="200"
            v-model="form.description"
            :rows="3"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="precision" label="检测精度：">
          <el-radio-group v-model="form.matchType" style="display: inline-block;margin-right: 10px;">
            <el-radio :label="0">文件级</el-radio>
            <el-radio :label="1">代码片段级</el-radio>
          </el-radio-group>
          <template v-if="form.matchType === 1">
            <el-input-number
              size="medium"
              style="width: 130px; display: inline-block;"
              v-model="form.matchCodeLine"
              @change="lineNumberChange"
              controls-position="right"
              :min="10"
              :max="100"
            >
            </el-input-number>
            行
          </template>
        </el-form-item>
      </el-row>
      <el-row class="form-item-language">
        <el-form-item prop="languageCodes" style="margin-bottom: 0;"  label="检测语言：">
          <el-checkbox style="display: inline-block;margin-right: 30px;" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group style="display: inline;" v-model="form.languageCodes" @change="handleCheckedCitiesChange">
            <el-checkbox :label="lab.key" v-for="lab in languages" :key="lab.value">{{lab.value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">确 定</el-button>
      <el-button @click="cancel" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { putSourceCheckByIdApi, getLanguageList, getSourceCheckByIdApi } from '@/api/home/assets/app/codeV4'
import { awaitTo as to, isObject } from '@/utils'

export default {
  name: 'DialogEdit',
  data () {
    const validatorLanguage = (rule, val, cb) => {
      if (val.length === 0) {
        cb(new Error('请选择语言'))
      } else {
        cb()
      }
    }
    return {
      title: '编辑应用',
      checkAll: false,
      isIndeterminate: false,
      dialogVisible: false,
      languages: [],
      rules: {
        languageCodes: [
          {
            validator: validatorLanguage,
            trigger: 'change'
          },
          {
            required: true,
            trigger: 'change'
          }
        ],
        name: [{
          required: true,
          message: '请输入应用名称',
          trigger: 'change'
        }],
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'change'
          }
        ]
      },
      form: {
        description: undefined,
        languageCodes: [],
        matchCodeLine: 10,
        matchType: 0,
        name: undefined,
        version: undefined
      },
      id: undefined
    }
  },
  methods: {
    // 提交
    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },

    lineNumberChange (numValue) {
      if (typeof numValue === 'undefined') {
        this.$nextTick(() => {
          this.form.line = 10
        })
      }
    },

    handleCheckAllChange (val) {
      this.form.languageCodes = val ? this.languages.map(item => item.key) : []
      this.isIndeterminate = false
    },

    handleCheckedCitiesChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.languages.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.languages.length
    },

    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.putSourceCode()
        } else {
          return false
        }
      })
    },
    async putSourceCode () {
      const [error] = await to(putSourceCheckByIdApi(this.form, this.id))
      if (isObject(error) && error.message) {
        this.$message.error(error.message)
      } else {
        this.cancel()
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.$emit('callback')
      }
    },

    // 取消
    cancel () {
      this.dialogVisible = false
    },

    open (id) {
      this.type = 1
      this.form = this.$options.data().form
      this.id = id
      this.dialogVisible = true
      this.getSourceCheck()
    },
    async getSourceCheck () {
      const [error, res] = await to(getSourceCheckByIdApi(this.id))
      if (isObject(error) && error.message) {
        this.$message.error(error.message)
      } else {
        this.form = {
          description: res.data.description,
          languageCodes: isArray(res.data.languages) ? res.data.languages.map(item => item.key) : [],
          matchCodeLine: res.data.matchCodeLine || 10,
          matchType: res.data.matchType || 0,
          name: res.data.name,
          version: res.data.version
        }

        this.checkAll = this.languages.length === this.form.languageCodes.length
        this.isIndeterminate = (!this.checkAll) && Array.isArray(this.form.languageCodes) && this.form.languageCodes.length > 0
      }
    },
    async getLanguageList () {
      const [error, res] = await to(getLanguageList({ loading: false }))
      if (isObject(error) && error.message) {
        this.$message.error(error.message)
      } else {
        this.languages = this.get(res, 'data', [])
      }
    }
  },
  mounted () {
    this.getLanguageList()
  }
}
</script>
<style lang="scss" scoped>
.form-item-language {
  :deep(.el-form-item__label) {
    flex: none !important;
  }
}
</style>
