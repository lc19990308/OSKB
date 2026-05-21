<template>
  <div class="view-content">
    <Sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
      <div>
        <el-button size="medium" class="right" type="primary" @click="reset">
          恢复默认
        </el-button>
      </div>
    </Sticky>
    <el-form ref="form" label-width="200px" :rules="rules" :model="form" class="conf-form">
      <el-form-item label="封面图片：">
        <select-image :limit="1" :accept="'.jpg,.jpeg,.png'" v-model="form.coverImage"></select-image>
        <span class="hint">请上传.jpg,.jpeg,.png格式图片，推荐尺寸2400*3508像素。</span>
      </el-form-item>
      <el-form-item label="页眉logo：">
        <select-image :limit="1" :accept="'.png'" v-model="form.headerImage"></select-image>
        <span class="hint">请上传.png格式图片，推荐尺寸116*54像素。</span>
      </el-form-item>
      <el-form-item label="报告logo：">
        <select-image :limit="1" :accept="'.png'" v-model="form.coverLogoImage"></select-image>
        <span class="hint">请上传.png格式图片，推荐尺寸116*54像素。</span>
      </el-form-item>
      <el-form-item label="水印文字：" prop="reportWatermark">
        <el-input type="text" v-model="form.watermarkText" maxlength="15" show-word-limit
                  autocomplete="off"></el-input>
        <span class="watermark-tips">仅支持Word、PDF、HTML格式</span>
      </el-form-item>
      <el-form-item label="页眉文字：" prop="headerText">
        <el-input type="text" v-model="form.headerText" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="报告标题：" prop="title">
        <el-input type="text" v-model="form.title" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="m-b clearfix">
      <el-button size="medium" class="m-t-md w-90" type="primary" @click="submit">
        保 存
      </el-button>
    </div>
  </div>
</template>
<script>
import SelectImage from '@/components/public/SelectImage/index.vue'
import { getReportConf, setReportConf, resetReportConf } from '@/api/home/report/style'
import Sticky from '@/components/public/Sticky/index.vue'

export default {
  name: 'reportConf',
  components: {
    SelectImage,
    Sticky
  },
  data () {
    // const headerTextValidator = (rule, value, callback) => {
    //   if (/\s/.test(value)) {
    //     callback(new Error())
    //   } else {
    //     callback()
    //   }
    // }

    return {
      rules: {
        headerText: [
          { required: true, message: '页眉文字不能为空', trigger: ['blur', 'change'] }
          // { validator: headerTextValidator, message: '页眉文字不支持空格', trigger: ['blur', 'change'] }
        ],
        title: [
          { required: true, message: '报告标题不能为空', trigger: ['blur', 'change'] }
          // { validator: headerTextValidator, message: '报告标题不支持空格', trigger: ['blur', 'change'] }
        ]
      },
      form: {
        headerText: '',
        title: '',
        watermarkText: '',
        coverImage: [],
        headerImage: [],
        coverLogoImage: []
      }
    }
  },
  methods: {
    // 恢复默认
    reset () {
      this.$confirm('是否将报告配置重置为默认配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetReportConf({}).then(() => {
          this.$message.success('操作成功！')
          this.getReportConf()
        }).catch(error => {
          if (typeof error === 'object') {
            this.$message.error(error.message)
          }
        })
      }).catch(() => {
        this.$message({
          message: '已取消操作'
        })
      })
    },

    // 提交
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const formData = new FormData()
          if (this.form.headerText) {
            formData.append('headerText', this.form.headerText)
          }
          if (this.form.title) {
            formData.append('title', this.form.title)
          }
          formData.append('watermarkText', this.form.watermarkText)

          if (this.form.coverImage[0] && this.form.coverImage[0] instanceof File) {
            formData.append('coverImage', this.form.coverImage[0])
          } else if (!this.form.coverImage[0]) {
            formData.append('deleteCoverImage', 1)
          }
          if (this.form.headerImage[0] && this.form.headerImage[0] instanceof File) {
            formData.append('headerImage', this.form.headerImage[0])
          } else if (!this.form.headerImage[0]) {
            formData.append('deleteHeaderImage', 1)
          }
          if (this.form.coverLogoImage[0] && this.form.coverLogoImage[0] instanceof File) {
            formData.append('coverLogoImage', this.form.coverLogoImage[0])
          } else if (!this.form.coverLogoImage[0]) {
            formData.append('deleteCoverLogoImage', 1)
          }

          setReportConf(
            formData
          ).then(() => {
            this.$message.success('操作成功！')
            this.getReportConf()
          }).catch(error => {
            this.getReportConf()
            if (typeof error === 'object') {
              this.$message.error(error.message)
            }
          })
        } else {
          return false
        }
      })
    },

    // 初始化页面配置
    getReportConf () {
      getReportConf({
        loading: false
      }).then((response) => {
        const data = response.data
        this.form = {
          headerText: data.headerText,
          title: data.title,
          watermarkText: data.watermarkText,
          coverImage: [],
          headerImage: [],
          coverLogoImage: []
        }
        if (data.coverImagePath && data.coverImagePath !== 'delete') {
          this.form.coverImage.push({ url: data.coverImagePath })
        }
        if (data.headerImagePath && data.headerImagePath !== 'delete') {
          this.form.headerImage.push({ url: data.headerImagePath })
        }
        if (data.coverLogoImagePath && data.coverLogoImagePath !== 'delete') {
          this.form.coverLogoImage.push({ url: data.coverLogoImagePath })
        }
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    this.getReportConf()
  }
}
</script>
<style scoped lang="scss">
.clearfix {
  display: flex;
  justify-content: center;
}

.conf-form {
  max-width: 1000px;

  .el-input {
    max-width: 300px;
  }

  .upload-wrap {
    display: inline-block;
  }

  .hint {
    vertical-align: bottom;
    display: inline-block;
    margin-bottom: 30px;
    margin-left: 30px;
    color: #999;
  }
}

.watermark-tips {
  position: absolute;
  font-size: 12px;
  color: #ccc;
  left: 5px;
  bottom: -27px;
}
</style>
