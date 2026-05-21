<template>
  <el-dialog
    title="上传应用包"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="800px"
    @close="close"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      label-width="170px"
      :rules="rules"
      ref="uploadForm"
      inline
      size="medium"
      class="form"
      label-position="right"
    >
      <el-row v-if="projectMixin.id === -1">
        <el-form-item prop="projectId"  label="所属项目：">
          <el-select-v2-project class="input" @change="$refs.uploadForm.validateField('version')" v-model="form.projectId" v-if="projectMixin.id === -1"></el-select-v2-project>
          <el-input
            :value="projectMixin.name"
            v-else
            readonly
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="sourceCheckInfo.name" label="应用名称：">
          <el-input
            clearable
            placeholder="请输入应用名称"
            v-model="form.sourceCheckInfo.name"
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="sourceCheckInfo.version" label="版本号：">
          <el-input
            clearable
            placeholder="请输入版本号"
            v-model="form.sourceCheckInfo.version"
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="sourceCheckInfo.description" label="应用描述：">
          <el-input
            class="input"
            type="textarea"
            placeholder="请输入应用描述"
            :maxlength="200"
            v-model="form.sourceCheckInfo.description"
            :rows="3"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-row>
      <el-row class="form-item-row">
        <el-form-item label="上传成功后自动检测：">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="form.isAddTask">
          </el-switch>
        </el-form-item>
      </el-row>
      <el-row class="form-item-row" style="padding-left: 160px;" :class="{disabled: !form.isAddTask}">
        <el-row>
          <el-form-item prop="sourceCheckInfo.matchType" label-width="95px" label="检测精度：">
            <el-radio-group :disabled="!form.isAddTask" v-model="form.sourceCheckInfo.matchType">
              <el-radio :label="0" style="margin-right: 16px">文件级</el-radio>
              <el-radio :label="1">代码片段级</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.sourceCheckInfo.matchType === 1">
            <el-input-number
              style="margin-top: -10px;"
              :disabled="!form.isAddTask"
              size="medium"
              v-model="form.sourceCheckInfo.matchCodeLine"
              @change="lineNumberChange"
              controls-position="right"
              :min="10"
              :max="100"
            >
            </el-input-number>
            行
          </template>
        </el-row>
        <el-row class="form-item-language">
          <el-form-item prop="sourceCheckInfo.languageCodes" :rules="[
          {
            validator: validatorLanguage,
            trigger: 'change'
          },
          {
            required: !!form.isAddTask,
            trigger: 'change'
          }
        ]" :disabled="!form.isAddTask" label="检测语言：" label-width="95px" style="display: flex;">
            <el-checkbox :disabled="!form.isAddTask" style="display: inline-block;margin-right: 30px;" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group :disabled="!form.isAddTask" style="display: inline;" v-model="form.sourceCheckInfo.languageCodes"
                               @change="handleCheckedCitiesChange">
              <el-checkbox :label="lab.key" v-for="lab in languages" :key="lab.value">{{lab.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
      </el-row>
      <div>
        <el-form-item label="选择应用包：" prop="upload" style="margin-bottom: 0;" :rules="[{ required: true, message: '请选择应用包', trigger: 'change'}]">
          <div class="upload-warp">
            <el-upload
              action="#"
              class="upload-demo"
              drag
              @drop.native="e => beforeUpload(e.dataTransfer.files[0])"
              :http-request="customUpload"
              :on-change="uploadChange"
              :on-remove="uploadChange"
              :show-file-list="true"
              ref="upload"
              name="file"
              :limit="1"
              :auto-upload="false"
              :accept="accept">
              <i class="iconfont icona-wenjianshangchuan1" style="margin:15px 0 0 0;"></i>
              <div class="el-upload__text" style="line-height: 24px;">
                点击或将文件拖拽到这里上传<br>
                <span style="font-size: 13px">支持上传的应用包格式：*.tar、*.bz2、*.tar.bz2、*.gz、*.7z、*.zip、*.rar</span>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">上传并保存</el-button>
      <el-button @click="dialogVisible = false" class="w-80" size="medium">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { awaitTo as to, awaitTo, isObject } from '@/utils'
import { append } from '@/components/public/SliceUpload'
import { checkSuffix } from '@/utils/validate'
import {
  appPackageFileSlice,
  appPackageFileReceived,
  batchTesting,
  checkRepeat,
  getLanguageList
} from '@/api/home/assets/app/codeV4'
import { cloneDeep } from 'lodash-es'
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project.vue'
// import ElSelectV2 from '@/components/public/SelectV2'

export default {
  name: 'DialogUploadApp',
  components: { ElSelectV2Project },
  // components: { ElSelectV2 },
  props: {
    callback: {
      type: Function,
      default: () => {
      }
    }
  },
  data () {
    const versionValidatorFn = (rule, val, cb) => {
      if (this.form.appName) {
        checkRepeat({
          appName: this.form.appName,
          version: val
        }).then(res => {
          if (res.data) {
            cb(new Error(`应用 ${this.form.appName} 的版本号已存在，请重新输入`))
          } else {
            cb()
          }
        }).catch(() => {
          cb()
        })
      } else {
        cb()
      }
    }
    return {
      accept: '.tar,.bz2,.tar.bz2,.gz,.7z,.zip,.rar',
      loading: false,
      languages: [],
      rules: {
        projectId: [{
          required: true,
          message: '请选择项目',
          trigger: 'change'
        }],
        sourceCheckInfo: {
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
            },
            {
              validator: versionValidatorFn,
              trigger: 'change'
            }
          ]
        }
      },
      dialogVisible: false,
      checkAll: true,
      isIndeterminate: false,
      form: {
        upload: null,
        isAddTask: 1,

        sourceCheckInfo: {
          description: undefined,
          languageCodes: [],
          matchCodeLine: 10,
          matchType: 0,
          name: undefined,
          version: undefined
        }
      }
    }
  },
  watch: {
    dialogVisible () {
      this.$refs.uploadForm && this.$refs.uploadForm.clearValidate()
    }
  },
  mounted () {
    this.getLanguageList()
  },
  methods: {
    validatorLanguage (rule, val, cb) {
      if (this.form.isAddTask === 1 && val.length === 0) {
        cb(new Error('请选择语言'))
      } else {
        cb()
      }
    },
    open () {
      this.checkAll = true
      this.form = this.$options.data().form
      this.form.projectId = this.projectMixin.id !== -1 ? this.projectMixin.id : null
      this.handleCheckAllChange(true)
      this.dialogVisible = true
    },
    async getLanguageList () {
      const [error, res] = await to(getLanguageList({ loading: false }))
      if (isObject(error) && error.message) {
        this.$message.error(error.message)
      } else {
        this.languages = this.get(res, 'data', [])
        this.handleCheckAllChange(true)
      }
    },
    uploadChange (file, list) {
      this.form.sourceCheckInfo.name = this.form.sourceCheckInfo.name ? this.form.sourceCheckInfo.name : (list.length > 0 ? file.name : null)
      this.form.upload = list.length > 0 ? true : null
      this.$refs.uploadForm.validateField('upload')
    },
    handleCheckAllChange (val) {
      this.form.sourceCheckInfo.languageCodes = val ? this.languages.map(item => item.key) : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.languages.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.languages.length
    },
    beforeUpload (file) {
      if (!checkSuffix(file.name, this.accept)) {
        this.$message.error('不支持该文件格式上传')
      }
    },
    customUpload ({ file }) {
      const that = this
      const fileItem = append(file, {
        request: {
          slice: appPackageFileSlice,
          received: appPackageFileReceived
        },
        params: {
          handler: 'code_file',
          projectId: this.form.projectId,
          originName: file.name,
          sourceCheckInfo: cloneDeep(this.form.sourceCheckInfo)
        },
        payload: {
          origin: this.$route.fullPath,
          isAddTask: this.form.isAddTask
        }
      })

      fileItem.on('success', async (fileItem, response) => {
        const { options } = fileItem
        const { payload } = options
        // 检测
        if (!payload.isAddTask) return
        await awaitTo(batchTesting({
          idList: [response.data.uploaded.id],
          loading: false
        }))
        that.$emit('callback')
      })
    },

    lineNumberChange (numValue) {
      if (typeof numValue === 'undefined') {
        this.$nextTick(() => {
          this.form.matchCodeLine = 10
        })
      }
    },
    // 提交
    confirm () {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          if (this.$refs.upload.uploadFiles.length) {
            this.$refs.upload.submit()
            this.dialogVisible = false
          }
        } else {
          return false
        }
      })
    },

    close () {
      this.$refs.upload.clearFiles()
      this.$refs.uploadForm.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.disabled {
  :deep(.el-form-item__label) {
    color: #dcdee0 !important;
    cursor: not-allowed;
  }
}

.form-item-row {
  .el-form-item {
    :deep(.el-form-item__content), :deep(.el-form-item__label) {
      line-height: 18px;
    }
  }

}

.form-item-language {
  :deep(.el-form-item__label) {
    flex: none !important;
  }
}

.upload-warp {
  width: 500px;

  .upload-demo {
    :deep(.el-upload-dragger) {
      width: 500px;
      height: 130px;

      .iconfont {
        display: inline-block;
        color: $color-primary;
        font-size: 40px;
        line-height: initial;
        margin: 40px 0 10px;
      }
    }
  }
}

.form {
  margin: 0 auto;

  .input {
    width: 500px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }
}

.read-file {
  .read-file-head {
    font-size: 16px;
    text-align: center;
  }

  .read-file-body {
    cursor: pointer;
    background-image: url(~@/assets/images/disabled-min-2.png);
    background-position: center;
    position: relative;
    overflow: hidden;
    margin: 0 auto 40px;
    width: 340px;
    height: 270px;

    #app-file {
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
}
</style>
