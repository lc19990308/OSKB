<template>
  <el-dialog
    title="上传应用包"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="700px"
    @open="open"
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
            v-model="projectMixin.name"
            v-else
            readonly
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="appName" label="应用包名称：">
          <el-input
            @input="$refs.uploadForm.validateField('version')"
            v-model="form.appName"
            clearable
            placeholder="请输入应用包名称"
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="version" label="版本号：">
          <el-input
            clearable
            v-model="form.version"
            placeholder="请输入版本号"
            class="input"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="上传成功后自动检测：">
          <el-switch
            v-model="isDetect">
          </el-switch>
        </el-form-item>
      </el-row>
      <div style="padding-left: 100px;" :class="{disabled: !isDetect}">
        <el-row>
          <el-form-item prop="check" label="审查方式：">
        <span slot="label">
          <el-tooltip class="item" placement="top">
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
            <el-radio v-model="form.checkType" :disabled="!isDetect" :label="0">快速审查</el-radio>
            <el-radio v-model="form.checkType" :disabled="!isDetect" :label="1">深度审查</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="deepLimit" label="解析深度：">
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
            <el-select :disabled="!isDetect" :style="{width: deepApply === 1 ? '160px' : '300px'}" v-model="deepApply" @change="form.deepLimit = 5"
                       placeholder="活动区域">
              <el-option label="默认（组件实际依赖层级）" :value="0"></el-option>
              <el-option label="自定义" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label=""
            prop="deepLimit"
            v-if="deepApply === 1">
            <el-input-number style="width: 125px;" :disabled="!isDetect" v-model="form.deepLimit" @change="numberChange" controls-position="right"
                             :min="1" :max="100" placeholder="自定义"></el-input-number>
            层
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="cleanLevel" label="数据清洗：">
        <span slot="label">
          <el-tooltip class="item" placement="top">
            <div style="width: 300px; line-height: 18px;" slot="content">
                快速清洗：只清洗无效组件，结果包含项目中所有可能引入的组件<br><br>
                深度清洗：清洗重复声明和未使用的组件，结果只包含有可能直接影响项目安全的组件，推荐使用该选项
              </div>
            <i class="iconfont iconbangzhu"></i>
          </el-tooltip>
          <span>
            数据清洗：
          </span>
        </span>
            <el-radio-group :disabled="!isDetect" v-model="form.cleanLevel">
              <!--          <el-radio :label="0">不做清洗</el-radio>-->
              <el-radio :label="1">快速清洗</el-radio>
              <el-radio :label="2">深度清洗</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </div>
      <div>
        <el-form-item label="选择应用包：" prop="upload" style="margin-bottom: 0;" :rules="[{ required: true, message: '请选择应用包', trigger: 'change'}]">
          <div class="upload-warp">
            <el-upload
              action="#"
              class="upload-demo"
              drag
              @drop.native="e => beforeUpload(e.dataTransfer.files[0])"
              :http-request="customUpload"
              :show-file-list="true"
              :on-change="uploadChange"
              :on-remove="onRemove"
              ref="upload"
              name="file"
              :limit="1"
              :auto-upload="false"
              :accept="accept">
              <i class="iconfont icona-wenjianshangchuan1" style="margin-top: 15px;margin-bottom: 0;"></i>
              <div class="el-upload__text" style="padding:0 10px 10px;line-height: 24px;">
                点击或将文件拖拽到这里上传<br>
                <span style="font-size: 13px">支持上传的应用包格式：*.jar, *.war, *.rar, *.zip, *.tar, *.tar.gz, *.tgz, *.tar.bz2, *.nuget, *.egg, *.whl</span>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">上传并保存</el-button>
      <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addTask, checkVersion } from '@/api/home/public/app'
import { awaitTo } from '@/utils'
import { append } from '@/components/public/SliceUpload'
import { checkSuffix } from '@/utils/validate'
import { appPackageFileSlice, appPackageFileReceived } from '@/api/public'
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project'

export default {
  name: 'DialogUploadApp',
  components: { ElSelectV2Project },
  props: {
    callback: {
      type: Function,
      default: () => {
      }
    }
  },
  data () {
    const versionValidatorFn = (rule, val, cb) => {
      if (this.form.appName && this.form.projectId) {
        checkVersion({
          appName: this.form.appName,
          version: val,
          projectId: this.form.projectId
        }).then(res => {
          cb()
        }).catch(error => {
          if (error) {
            if (error.code === 400042) {
              cb(new Error(`应用 ${this.form.appName} 的版本号已存在，请重新输入`))
            } else if (error.message) {
              cb(error.message)
            }
          }
        })
      } else {
        cb()
      }
    }
    return {
      accept: '.jar,.war,.rar,.zip,.tar,.tar.gz,.tgz,.gz,.tar.bz2,.nuget,.egg,.whl',
      isDetect: true,
      currentPage: 1,
      pageSize: 100,
      loading: false,
      rules: {
        projectId: [{
          required: true,
          message: '请选择项目',
          trigger: 'change'
        }],
        appName: [{
          required: true,
          message: '请输入应用包名称',
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
      },
      dialogVisible: false,
      file: null,
      deepApply: 0,
      form: {
        projectId: null,
        checkType: 0,
        cleanLevel: 2,
        deepLimit: 5,

        upload: null,
        appName: null,
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
    onRemove () {
      this.form.appName = undefined
      this.form.upload = null
      this.$refs.uploadForm.validateField('upload')
    },
    uploadChange (file, list) {
      this.form.appName = this.form.appName ? this.form.appName : (list.length > 0 ? file.name : null)
      this.form.upload = list.length > 0 ? true : null
      this.$refs.uploadForm.validateField('upload')
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
          handler: 'app_package',
          projectId: this.form.projectId,
          appName: this.form.appName,
          version: this.form.version
        },
        payload: {
          isDetect: this.isDetect,
          ...this.form,
          deepApply: this.deepApply
        }
      })

      fileItem.on('success', async (fileItem, response) => {
        const { options } = fileItem
        const { payload } = options
        setTimeout(() => {
          that.$emit('callback')
        }, 1000)
        if (payload.isDetect) {
          // 上传成功自动检测
          const params = {
            appPackageIds: [response.data.uploaded.id],
            cleanLevel: payload.cleanLevel,
            checkType: payload.checkType
          }
          payload.deepApply === 1 && (params.deepLimit = payload.deepLimit)
          await awaitTo(addTask(params))
          setTimeout(() => {
            that.$emit('callback')
          }, 1000)
        }
      })
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

    // 打开窗口时的回调
    open () {
      this.form.projectId = this.projectMixin.id !== -1 ? this.projectMixin.id : null
    },

    close () {
      this.$refs.upload.clearFiles()
      this.$refs.uploadForm.resetFields()
      this.files = []
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

.form-item-language {
  :deep(.el-form-item__label) {
    flex: none !important;
  }
}

.upload-warp {
  width: 400px;

  .upload-demo {
    :deep(.el-upload-dragger) {
      width: 400px;
      height: 150px;

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
    width: 400px;
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
