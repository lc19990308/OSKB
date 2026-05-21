<template>
  <div v-loading="loading">
    <div class="view-content">
      <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap fixed-operating-wrap-1'">
        <div>
          <el-button v-if="authorityFilter(2221)" size="medium" type="primary" @click="submit">
            保存
          </el-button>
          <el-button v-if="authorityFilter(2222)" size="medium" type="primary" @click="reset">
            恢复默认
          </el-button>
        </div>
      </sticky>
      <el-form :disabled="!authorityFilter(2221)" ref="ruleForm" label-width="200px" label-position="left" class="web-conf-form">
        <el-form-item label="地址栏icon：">
          <label slot="label">
            <el-tooltip class="item" effect="dark" content="请上传.ico、icon或png格式图片，推荐尺寸16*16像素。" placement="top">
              <i class="iconfont iconbangzhu"></i>
            </el-tooltip>
            地址栏icon
          </label>
          <select-image :limit="1" :accept="'.ico,.png'" v-model="form.icon"></select-image>
        </el-form-item>
        <el-form-item label="登录页面品牌logo设置：">
          <label slot="label">
            <el-tooltip class="item" effect="dark" content="请上传jpg、jpeg或png格式图片，推荐尺寸200*88像素。" placement="top">
              <i class="iconfont iconbangzhu"></i>
            </el-tooltip>
            登录页面品牌logo设置：
          </label>
          <select-image :limit="1" :accept="'.png,.jpg,.jpeg'" v-model="form.brandLogo"></select-image>
        </el-form-item>
        <el-form-item label="登录页面平台logo设置：">
          <label slot="label">
            <el-tooltip class="item" effect="dark" content="请上传jpg、jpeg或png格式图片，推荐尺寸500*80像素。" placement="top">
              <i class="iconfont iconbangzhu"></i>
            </el-tooltip>
            登录页面平台logo设置：
          </label>
          <select-image :limit="1" :accept="'.png,.jpg,.jpeg'" v-model="form.loginLogo"></select-image>
        </el-form-item>
        <el-form-item label="导航栏图片：">
          <label slot="label">
            <el-tooltip class="item" effect="dark" content="请上传jpg、jpeg或png格式图片，推荐尺寸170*46像素。" placement="top">
              <i class="iconfont iconbangzhu"></i>
            </el-tooltip>
            导航栏图片：
          </label>
          <select-image :limit="1" :accept="'.png,.jpg,.jpeg'" v-model="form.navLogo"></select-image>
        </el-form-item>
        <el-form-item label="折叠导航栏图片：">
          <label slot="label">
            <el-tooltip class="item" effect="dark" content="请上传jpg、jpeg或png格式图片，推荐尺寸94*96像素。" placement="top">
              <i class="iconfont iconbangzhu"></i>
            </el-tooltip>
            折叠导航栏图片：
          </label>
          <select-image :limit="1" :accept="'.png,.jpg,.jpeg'" v-model="form.foldNavLogo"></select-image>
        </el-form-item>
        <el-form-item label="登录页关键字：">
          <el-input type="text" ref="keyWord" v-model="form.loginPageKeyWord" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版权信息：">
          <el-input type="text" readonly ref="keyWord" v-model="form.copyright" autocomplete="off"></el-input>
        </el-form-item>
        <!--      <el-form-item label="登录动画：">-->
        <!--        <el-switch-->
        <!--          v-model="form.loginAnimation"-->
        <!--         >-->
        <!--        </el-switch>-->
        <!--      </el-form-item>-->
      </el-form>
    </div>
  </div>
</template>
<script>
import SelectImage from '@/components/public/SelectImage/index.vue'
import { getWebconf, updateWebconf, resetWebconf } from '@/api/home/system/webConf'
import Sticky from '@/components/public/Sticky/index.vue'
import { mapActions } from 'vuex'

export default {
  name: 'webConf',
  components: {
    SelectImage,
    Sticky
  },
  inject: ['initSiteInfo'],
  data () {
    return {
      loading: false,
      form: {
        icon: [],
        brandLogo: [],
        loginLogo: [],
        navLogo: [],
        foldNavLogo: [],
        loginPageKeyWord: '',
        copyright: ''
      }
    }
  },
  methods: {
    ...mapActions(['setSiteInfo']),

    reset () {
      resetWebconf().then(() => {
        this.$message.success('操作成功!')
        this.getWebConf()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 更新界面配置
    submit () {
      const formData = new FormData()
      // 地址栏logo
      if (this.form.icon[0] && this.form.icon[0] instanceof File) {
        formData.append('favicon', this.form.icon[0])
      } else if (!this.form.icon[0]) {
        formData.append('removeFavicon', 1)
      }
      // 品牌logo
      if (this.form.brandLogo[0] && this.form.brandLogo[0] instanceof File) {
        formData.append('brandLogo', this.form.brandLogo[0])
      } else if (!this.form.brandLogo[0]) {
        formData.append('removeBrandLogo', 1)
      }
      // 登录页logo
      if (this.form.loginLogo[0] && this.form.loginLogo[0] instanceof File) {
        formData.append('loginLogo', this.form.loginLogo[0])
      } else if (!this.form.loginLogo[0]) {
        formData.append('removeLoginLogo', 1)
      }
      // 导航栏logo
      if (this.form.navLogo[0] && this.form.navLogo[0] instanceof File) {
        formData.append('navMenuIcon', this.form.navLogo[0])
      } else if (!this.form.navLogo[0]) {
        formData.append('removeNavMenuIcon', 1)
      }
      // 收缩导航栏logo
      if (this.form.foldNavLogo[0] && this.form.foldNavLogo[0] instanceof File) {
        formData.append('navMenuIconMini', this.form.foldNavLogo[0])
      } else if (!this.form.foldNavLogo[0]) {
        formData.append('removeNavMenuIconMini', 1)
      }
      formData.append('loginPageTitle', this.form.loginPageKeyWord)
      formData.append('copyright', this.form.copyright)
      updateWebconf(formData).then(() => {
        this.$message.success('操作成功!')
        this.getWebConf()
        this.initSiteInfo()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },

    // 初始化页面配置
    getWebConf () {
      this.loading = true
      getWebconf({
        loading: false
      }).then((response) => {
        this.loading = false
        const data = response.data
        this.$store.dispatch('setSiteInfo', data)
        this.form = {
          icon: [],
          brandLogo: [],
          loginLogo: [],
          navLogo: [],
          foldNavLogo: [],
          loginPageKeyWord: data.loginPageTitle,
          copyright: data.copyright
        }
        if (data.faviconUrl && data.faviconUrl !== 'remove') {
          this.form.icon.push({
            url: data.faviconUrl
          })
        }
        if (data.brandLogoUrl && data.brandLogoUrl !== 'remove') {
          this.form.brandLogo.push({
            url: data.brandLogoUrl
          })
        }
        if (data.loginLogoUrl && data.loginLogoUrl !== 'remove') {
          this.form.loginLogo.push({
            url: data.loginLogoUrl
          })
        }
        if (data.navMenuIconUrl && data.navMenuIconUrl !== 'remove') {
          this.form.navLogo.push({
            url: data.navMenuIconUrl
          })
        }
        if (data.navMenuIconMiniUrl && data.navMenuIconMiniUrl !== 'remove') {
          this.form.foldNavLogo.push({
            url: data.navMenuIconMiniUrl
          })
        }
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  mounted () {
    this.getWebConf()
  }
}
</script>
<style scoped lang="scss">
.view-content {
  background-color: #fff;
}

.clearfix {
  display: flex;
  justify-content: center;
}

.web-conf-form {
  margin-top: 30px;
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
</style>
