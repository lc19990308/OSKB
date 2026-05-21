<template>
  <el-dialog
    title="编辑"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="700px"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true">
    <el-form ref="formInstance" inline :model="formData" :rules="rules" class="form-step-2 label-top-form" label-width="120px" size="medium">
      <el-row>
        <el-form-item label="仓库地址：">{{get(desc, 'gitUrl', '-')}}</el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="检测分支：">{{get(desc, 'branch', '-')}}</el-form-item>
      </el-row>
<!--      <el-row>-->
<!--        <el-form-item label="账号密码：">-->
<!--          <el-input v-model="formData.acc" style="width: 200px;" clearable placeholder="请输入用户名"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="">-->
<!--          <el-input v-model="formData.password" style="width: 200px;" clearable placeholder="请输入密码"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="">-->
<!--          <el-link type="primary" class="m-r-5" :underline="false">测试连接</el-link>-->
<!--          <i class="el-icon-loading text-primary m-r-5 middle"></i>-->
<!--          <i class="el-icon-success text-success m-r-5 middle"></i>-->
<!--          <i class="el-icon-success text-danger middle"></i>-->
<!--        </el-form-item>-->
<!--      </el-row>-->
      <el-row>
        <el-form-item label="仓库名称：" prop="name">
          <el-input v-model="formData.name" class="m-r-10" style="width: 400px;" clearable placeholder="请输入仓库名称"></el-input>
          <span v-if="validatorLoading" class="text-primary">校验中<i class="el-icon-loading m-l-5"></i></span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="仓库说明：">
          <el-input
            clearable
            v-model="formData.description"
            type="textarea"
            :rows="3"
            style="width: 400px;"
            placeholder="请输入仓库说明"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onsubmit" type="primary" size="medium" class="w-80">保存</el-button>
      <el-button @click="cancel" size="medium" class="w-80 m-r-20">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, defineExpose, defineEmits, nextTick } from 'vue'
import { editGitConfig, validateBeforeSave } from '@/api/home/scan/develop/repository/git'
import { useApp } from '@/hooks/useApp'

const emit = defineEmits(['change'])
const { message } = useApp()

const validatorLoading = ref(false)
const dialogVisible = ref(false)
const formInstance = ref(null)
const formData = reactive({
  description: '',
  id: '',
  projectId: '',
  name: ''
})

const validator = (rule, value, callback) => {
  if (value) {
    if (value.length > 30) {
      callback(new Error('不可超过30个字符'))
    } else {
      validatorLoading.value = true
      validateBeforeSave(formData)
        .then(res => callback())
        .catch(() => callback(new Error('仓库名称已存在')))
        .finally(() => {
          validatorLoading.value = false
        })
    }
  } else {
    callback(new Error('请输入仓库名称'))
  }
}

const rules = {
  name: [
    { required: true, validator: validator, trigger: 'change' }
  ]
}

const desc = ref(null)

const open = (row) => {
  dialogVisible.value = true
  desc.value = row
  formData.name = row.name
  formData.id = row.id
  formData.projectId = row.projectId
  formData.description = row.description
  nextTick(() => formInstance.value.validateField(['name']))
}

const cancel = () => {
  dialogVisible.value = false
}

const onsubmit = () => {
  formInstance.value.validate(async (valid) => {
    if (valid) {
      editGitConfig(formData).then(res => {
        message.success('保存成功。')
        emit('change')
        cancel()
      }).catch(error => {
        if (isObject(error) && error.message) {
          message.error(error.message)
        }
      })
    } else {
      return false
    }
  })
}

defineExpose({ open })

</script>

<script>
export default {
  name: 'DialogEdit'
}
</script>

<style scoped lang="scss">
.el-form {
  padding: 0 0 0 30px;
}
</style>
