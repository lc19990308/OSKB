<template>
  <el-dialog
    title="上传应用包"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    width="850px"
    @open="open"
    @close="close"
    :close-on-click-modal="false"
  >
    <el-alert class="m-b-20" :closable="false" type="primary">
      <div style="display: flex;align-items: center;justify-content: space-between;">
        <div style="flex: 1;line-height: 22px;">
          SPDX、CycloneDX标准及
          支持Excel、JSON格式文件的导入检测，各类文件格式支持如下：<br>
          1. SPDX：tag:value(*.spdx), RDF(*.spdx.rdf), JSON(*.spdx.json), XML(*.spdx.xml), YAML(*.spdx.yaml or *.spdx.yml)；<br>
          2. CycloneDX：JSON(*.json), XML(*.xml)；<br>
          3. SWID：JSON(*.json)，XML(*.xml)，CBOR(*.cbor)；<br>
          4. Excel：.xls, .xlsx，请先下载模板，将您要扫描的组件信息按模板格式填充后再上传扫描；<br>
          5. JSON：通过XMIRROR-SCA-CLI客户端检测工具生成的JSON格式的检测结果文件。
        </div>
        <div style="text-align: right;margin-left: 5px;">
          <el-button
            size="small"
            type="primary"
            @click="downloadTemplate"
          >
            下载模板
          </el-button>
        </div>
      </div>
    </el-alert>
    <el-form
      :model="form"
      label-width="110px"
      :rules="rules"
      ref="uploadForm"
      size="medium"
      class="form"
      label-position="right"
    >
      <el-form-item v-if="projectMixin.id === -1" prop="projectId"  label="所属项目：">
        <el-select-v2-project class="w-full" @change="$refs.uploadForm.validateField('version')"
                              v-model="form.projectId"
                              v-if="projectMixin.id === -1"></el-select-v2-project>
        <el-input
          v-model="projectMixin.name"
          v-else
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item prop="name" label="应用包名称：">
        <el-input
          class="w-full"
          @input="$refs.uploadForm.validateField('version')"
          v-model="form.name"
          clearable
          placeholder="请输入应用包名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="version" label="版本号：">
        <el-input
          clearable
          v-model="form.version"
          placeholder="请输入版本号"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择应用包：" prop="upload" style="margin-bottom: 0;" :rules="[{ required: true, message: '请选择应用包', trigger: 'change'}]">
        <el-upload
          class="w-full"
          action="#"
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
          <div class="el-upload__text" style="padding:40px 10px 10px 10px;line-height: 24px;">
            <i class="iconfont icona-wenjianshangchuan1 text-primary" style="font-size: 32px;"></i>
            <br>
            点击或将文件拖拽到这里上传<br>
            <span class="text-regular" style="font-size: 13px">
             支持上传的文件格式： SPDX/CycloneDX/SWID标准的格式， Excel(*.xls/*.xlsx)，JSON，压缩包格式(*.zip/*.rar)
            </span>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="medium">上传并检测</el-button>
      <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { downloadBlobFile, to } from '@/utils'
import { append } from '@/components/public/SliceUpload'
import { checkSuffix } from '@/utils/validate'
import ElSelectV2Project from '@/views/home/project/conf/ElSelectV2Project'
import {
  sbomPackageFileReceived,
  sbomPackageFileSlice,
  addTask,
  checkVersion,
  downloadTemplateExcel
} from '@/api/home/scan/sbom'

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
      if (val) {
        if (this.form.name && this.form.projectId) {
          checkVersion({
            name: this.form.name,
            version: val,
            projectId: this.form.projectId
          }).then(res => {
            cb()
          }).catch(error => {
            if (error) {
              if (error.code === 400042) {
                cb(new Error(`应用 ${this.form.name} 的版本号已存在，请重新输入`))
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
      accept:
        '.zip,.rar,.xls,.xlsx,.json,.xml,.spdx.rdf,.spdx.json,.spdx.xml,.spdx.yaml,.spdx.yml,.spdx,.rdf,.yaml,.json,.JSON,.cbor',
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

        upload: null,
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
    onRemove () {
      this.form.name = undefined
      this.form.upload = null
      this.$refs.uploadForm.validateField('upload')
    },
    uploadChange (file, list) {
      this.form.name = this.form.name ? this.form.name : (list.length > 0 ? file.name : null)
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
          slice: sbomPackageFileSlice,
          received: sbomPackageFileReceived
        },
        params: {
          handler: 'sbom_package',
          projectId: this.form.projectId,
          appName: this.form.name,
          version: this.form.version
        },
        payload: {
          isDetect: this.isDetect,
          ...this.form,
          deepApply: this.deepApply
        }
      })

      fileItem.on('success', async (fileItem, response) => {
        // const { options } = fileItem
        // const { payload } = options
        setTimeout(() => {
          that.$emit('callback')
        }, 1000)
        await to(addTask({
          appPackageIds: [response.data.uploaded.id]
        }))
        setTimeout(() => {
          that.$emit('callback')
        }, 1000)
      })
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

    /**
     * @name 模板下载
     * @returns {Promise<void>}
     */
    async downloadTemplate () {
      try {
        const result = await downloadTemplateExcel()
        await downloadBlobFile(result)
      } catch (error) {
        this.$message.error(error.message)
      }
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
:deep(.el-upload-dragger) {
  width: auto;
  height: auto;
}

:deep(.el-alert) {
  padding: 8px 10px;
  .el-alert__content {
    padding: 0;
    width: 100%;
  }
}

.form {
  width: 600px;
  margin: 0 auto;
  padding-right: 30px;
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
