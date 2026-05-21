<template>
  <div>
    <span class="text-primary m-l-md m-r-sm" v-if="token">token已生成</span>
    <el-button type="primary" v-if="token" size="mini" @click="copyText(token)">复制</el-button>
    <el-alert :closable="false" type="primary" class="header-alert">
      <i class="el-icon-info m-r-5"></i>以和蓝鲸平台对接的插件，有些功能只需要一个插件，有些功能需要多个插件组合完成。使用流程：在平台中点击下载按钮，下载插件，进入蓝鲸平台研发商店 - 工作台 - 新增插件（标识：插件下载后的zip包名称，就是标识。开发语言：选择Java。自定义前端：选择否）。进入发布管理，新增版本，可以编辑插件的详细信息，发布包上传插件。
      <el-button  v-if="token" type="primary" size="mini" class="handle" @click="copyText(token)">复制</el-button>
      <el-button  v-else :loading="loading" type="primary" size="mini" class="handle" @click="generateToken">生成token</el-button>
    </el-alert>
    <el-row :gutter="20">
      <el-col :span="8" class="plugin">
        <div class="content">
          <div class="plugin-bg">
            <el-image fit="fill" :src="img1"></el-image>
          </div>
          <div class="plugin-information">
            <p class="plugin-title">
              提交检测任务插件
            </p>
            <p class="plugin-description">
              提交应用包威胁审查的检测任务
            </p>
            <el-button size="medium" class="plugin-btn" @click="download(1)" type="primary">下载</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="plugin">
        <div class="content">
          <div class="plugin-bg">
            <el-image fit="fill" :src="img2"></el-image>
          </div>
          <div class="plugin-information">
            <p class="plugin-title">
              获取应用包威胁审查报告插件
            </p>
            <p class="plugin-description">
              查看应用包威胁审查的检测任务状态，下载报告
            </p>
            <el-button size="medium" class="plugin-btn" @click="download(2)" type="primary">下载</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserToken, generateUserToken, downloadPlugIn } from '@/api/home/system/docking/blueWhale'
import { copyText } from '@/utils'

export default {
  name: 'blueWhale',
  data () {
    return {
      loading: false,
      token: '',
      img1: require('@/assets/images/plugin-img/img_3.png'),
      img2: require('@/assets/images/plugin-img/img_4.png'),
      img3: require('@/assets/images/plugin-img/img_5.png')
    }
  },
  methods: {
    // 获取用户token
    getToken () {
      this.loading = true
      getUserToken({
        loading: false
      }).then(response => {
        this.token = response.data.token
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.message) {
          this.$message.error(error.message)
        }
      })
    },
    // 生成用户token
    generateToken () {
      generateUserToken({
        loading: false
      }).then(response => {
        this.$message.success('生成成功')
        this.getToken()
      }).catch(error => {
        if (error.message) {
          this.$message.error(error.message)
        }
      })
    },
    // 下载插件
    download (row) {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', downloadPlugIn({
        type: row
      }))
      document.documentElement.appendChild(a)
      a.target = '_black'
      a.click()
      document.documentElement.removeChild(a)
    },
    copyText: copyText
  },
  mounted () {

  }
}
</script>

<style scoped lang="scss">
.plugin {
  height: 320px;

  .content {
    width: 100%;
    height: 100%;
    box-shadow: 0 0 15px -5px rgba(30, 136, 229, 50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .plugin-bg {
      width: 100%;
      height: 145px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px 5px 0 0;
      background: linear-gradient(to right, #c9e8ff, #e1f4ff);
    }

    .plugin-information {
      flex: 1;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 0 0 5px 5px;
      background: #fff;
      padding: 0 20px;
      box-sizing: border-box;

      .plugin-title {
        text-align: center;
        color: #7C3AED;
        font-size: 16px;
        letter-spacing: 1px;
        margin: 0;
      }

      .plugin-description {
        width: 100%;
        height: 45px;
        color: #404040;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
      }

      .plugin-btn {
        width: 90px;
      }
    }
  }
}

:deep(.header-alert) {
  position: relative;
  margin-bottom: 20px;
  padding: 13px;
  padding-right: 100px;

  .el-alert__content {
    padding: 0;

    .el-alert__description {
      padding: 0;
      margin: 0;
    }

    .handle {
      position: absolute;
      right: 13px;
      transform: translateY(-50%);
      padding-bottom: 6px;
      top: 50%;
    }
  }
}
</style>
