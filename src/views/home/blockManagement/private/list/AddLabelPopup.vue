<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="600px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    modal-append-to-body
    append-to-body>
    <el-form :model="formData" label-width="90px"  :rules="rules" style="padding-left: 35px;" ref="form" size="medium" label-position="right" @submit.native.prevent>
      <el-form-item label="请求IP：">
        {{formData.name}}
      </el-form-item>
      <el-form-item label="标签名称：" prop="value">
        <el-select placeholder="请输入标签名称" :loading="loading" allow-create default-first-option filterable style="width: 370px;" clearable v-model="formData.value">
          <el-option
            v-for="item in tagList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="标签颜色：" style="margin-bottom: 10px;">
        <div style="padding-top: 8px;" class="flex">
          <span v-for="color in colors" class="color-option__item" :style="{'background-color': color}" :key="color" @click="formData.color = color">
            <i class="el-icon-check" v-if="color === formData.color"></i>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="描述：" style="margin-bottom: 0;">
        <el-input
          :rows="3"
          resize="none"
          style="width: 370px;"
          show-word-limit
          v-model="formData.description"
          type="textarea"
          placeholder="请输入标签描述">
        </el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" style="min-width: 70px;font-weight: normal" :loading="loading" @click="confirm" size="medium">确认</el-button>
      <el-button @click="cancel()" style="min-width: 70px; font-weight: normal" plain size="medium">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { putTagsApi, saveTagsApi } from '@/api/home/blockManagement/private'
import { to } from '@/utils'

export default {
  name: 'AddLabelPopup',
  props: ['tagList'],
  data () {
    return {
      title: '添加标签',
      dialogVisible: false,
      loading: false,
      formData: {
        value: '',
        name: '',
        color: '#1E88E5',
        description: ''
      },
      rules: {
        value: [
          { required: true, message: '请输入标签名称', trigger: 'change' }
        ]
      },
      colors: [
        '#FF4D4A',
        '#D4932A',
        '#35D09C',
        '#48CDC5',
        '#1E88E5'
      ]
    }
  },
  methods: {
    open (row, tag) {
      if (tag) {
        this.title = '编辑标签'
        this.formData.id = tag.id
        this.formData.value = tag.value
        this.formData.color = tag.color
        this.formData.description = tag.description
      } else {
        this.title = '添加标签'
      }
      this.formData.name = row.requestIP
      this.dialogVisible = true
    },
    async confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.title === '添加标签') {
            this.createTag()
          } else {
            this.updateTag()
          }
        } else {
          return false
        }
      })
    },
    async updateTag () {
      const [error, response] = await to(putTagsApi(this.formData))
      if (response) {
        this.$message.success('操作成功')
        this.$emit('change')
        this.cancel()
      } else if (error && error.message) {
        this.$message.error(error.message)
      }
    },
    async createTag () {
      const [error, response] = await to(saveTagsApi(this.formData))
      if (response) {
        this.$message.success('操作成功')
        this.$emit('change')
        this.cancel()
      } else if (error && error.message) {
        this.$message.error(error.message)
      }
    },
    cancel () {
      this.dialogVisible = false
      this.formData = this.$options.data().formData
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.color-option__item {
  display: inline-flex;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  margin-right: 20px;
  cursor: pointer;
}
:deep(.el-form-item__label) {
  padding: 0;
}
</style>
