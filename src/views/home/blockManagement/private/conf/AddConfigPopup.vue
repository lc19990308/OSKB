<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="600px"
    @close="cancel"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    modal-append-to-body
    append-to-body>
    <el-form :model="formData" label-width="130px" :rules="rules" ref="form" size="medium" style="padding: 0 60px 0 40px;">
      <el-form-item label="上游仓库名称：" prop="upstreamAlias">
        <el-input class="w-full" v-model="formData.upstreamAlias" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="上游仓库类型：" prop="repositoryType">
        <el-select class="w-full" v-model="formData.repositoryType" clearable placeholder="请选择">
          <el-option v-for="item in repositoryOptions" :value="item" :label="item" :key="'repository-' + item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上游仓库地址：" prop="upstream">
        <el-input class="w-full" v-model="formData.upstream" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="转发路径：" prop="path" style="margin-bottom: 0;">
        <el-input class="w-full" v-model="formData.path" clearable placeholder="请输入">
<!--          <template slot="prepend">/repo</template>-->
        </el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" style="min-width: 70px;font-weight: normal" :loading="loading" @click="confirm" size="medium">确认</el-button>
      <el-button @click="dialogVisible = false" style="min-width: 70px; font-weight: normal" plain size="medium">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { validateRoute, validateUrl } from '@/utils/validate'
import { editRepositoryConfApi, getRepositoryTypesApi, postRepositoryConfApi } from '@/api/home/blockManagement/private'
import { once, to, deepClone } from '@/utils'

export default {
  name: 'AddConfigPopup',
  data () {
    const validatorUrl = (rule, value, callback) => {
      if (validateUrl(value)) {
        callback()
      } else {
        callback(new Error())
      }
    }
    return {
      title: '仓库配置',
      loading: false,
      dialogVisible: false,
      formData: {
        path: '',
        repositoryType: '',
        upstream: '',
        upstreamAlias: ''
      },
      repositoryOptions: [],
      rules: {
        upstream: [
          { required: true, message: '请输入仓库地址', trigger: 'blur' },
          { validator: validatorUrl, message: 'url格式错误', trigger: ['blur', 'change'] }
        ],
        repositoryType: [
          { required: true, message: '请选择仓库类型', trigger: 'change' }
        ],
        upstreamAlias: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入转发路径', trigger: 'change' },
          {
            validator (rule, value, callback) {
              if (validateRoute(value)) {
                callback()
              } else {
                callback(new Error())
              }
            },
            message: '路径格式错误',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    open (row) {
      this.title = row ? '编辑仓库配置' : this.$options.data().title
      if (row) {
        this.formData = deepClone(row)
      }
      this.getRepositoryTypes()
      this.dialogVisible = true
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.title === '仓库配置' ? this.create() : this.edit()
        } else {
          return false
        }
      })
    },
    async edit () {
      const [error, response] = await to(editRepositoryConfApi(this.formData))
      if (response) {
        this.$message.success('操作成功')
        this.$emit('change')
        this.dialogVisible = false
      } else {
        error.message && this.$message.error(error.message)
      }
    },
    async create () {
      const [error, response] = await to(postRepositoryConfApi(this.formData))
      if (response) {
        this.$message.success('操作成功')
        this.$emit('change')
        this.dialogVisible = false
      } else {
        error.message && this.$message.error(error.message)
      }
    },
    cancel () {
      this.formData = this.$options.data().formData
      this.$refs.form.resetFields()
    }
  },
  created () {
    this.getRepositoryTypes = once(() => {
      getRepositoryTypesApi({ loading: false }).then(res => {
        this.repositoryOptions = get(res, 'data', [])
      })
    })
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-input-group__prepend) {
  color: #333333 !important;
  background-color: initial !important;
}
</style>
