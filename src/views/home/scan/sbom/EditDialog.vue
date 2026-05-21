<template>
  <el-dialog
    title="编辑应用"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      label-width="110px"
      :rules="rules"
      ref="uploadForm"
      size="medium"
      class="form"
      label-position="right"
    >
      <el-form-item prop="name" label="应用名称：">
        <el-input
          class="w-full"
          @input="$refs.uploadForm.validateField('version')"
          v-model="form.name"
          clearable
          placeholder="请输入应用名称, 限100个字符"
        ></el-input>
      </el-form-item>
      <el-form-item prop="version" style="margin-bottom: 10px;" label="版本号：">
        <el-input
          clearable
          v-model="form.version"
          placeholder="请输入版本号"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">保存</el-button>
      <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateSbom, checkVersion } from '@/api/home/scan/sbom'

export default {
  name: 'DialogEditSBOM',
  props: {
    callback: {
      type: Function,
      default: () => {
      }
    }
  },
  data () {
    const versionValidatorFn = (rule, val, cb) => {
      if (val) {
        if (this.form.name && this.form.projectId) {
          checkVersion({
            id: this.form.id,
            name: this.form.name,
            version: val,
            projectId: this.form.projectId
          }).then(res => {
            cb()
          }).catch(error => {
            if (error) {
              if (error.code === 400042) {
                cb(new Error('应用的版本号已存在，请重新输入'))
              } else if (error.message) {
                cb(error.message)
              }
            }
          })
        } else {
          cb()
        }
      } else {
        cb(new Error('请输入版本号'))
      }
    }
    return {
      accept: '.jar,.war,.rar,.zip,.tar,.tar.gz,.tgz,.gz,.tar.bz2,.nuget,.egg,.whl',
      isDetect: true,
      currentPage: 1,
      pageSize: 100,
      loading: false,
      rules: {
        name: [
          {
            required: true,
            validator (rule, val, cb) {
              if (val) {
                if (/^[^\\/:*?"<>|\s]{1,100}$/g.test(val)) {
                  cb()
                } else {
                  return cb(new Error('应用名称不可超过100个字符，不能包含 \\ /:*?"<>| 任何字符'))
                }
              } else {
                cb(new Error('请输入应用名称'))
              }
            },
            trigger: 'change'
          }
        ],
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'change'
          },
          {
            validator: versionValidatorFn,
            trigger: 'change'
          }
        ]
      },
      dialogVisible: false,
      file: null,
      deepApply: 0,
      form: {
        id: undefined,
        projectId: null,
        name: null,
        version: null
      }
    }
  },
  watch: {
    dialogVisible () {
      this.$refs.uploadForm && this.$refs.uploadForm.clearValidate()
    }
  },
  methods: {
    // 提交
    confirm () {
      this.$refs.uploadForm.validate(async (valid) => {
        if (valid) {
          const [error] = await to(updateSbom(this.form))
          if (error && error.message) return this.$message.error(error.message)
          this.$message.success('操作成功。')
          this.$emit('change')
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },

    // 打开窗口时的回调
    open (row) {
      this.form = {
        id: row.id,
        projectId: row.projectId,
        name: row.name,
        version: row.version
      }
      this.dialogVisible = true

      this.$nextTick(() => {
        this.$refs.uploadForm.validateField('version')
      })
    }
  }
}
</script>
<style scoped lang="scss">
:deep(.el-upload-dragger) {
  width: auto;
  height: auto;
}

:deep(.el-alert) {
  padding: 8px 10px;
}

.form {
  margin: 0 auto;
  padding: 0 40px;
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
