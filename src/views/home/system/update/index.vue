<template>
  <el-main class="main">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header">
            系统当前版本
          </div>
          <el-row class="common-body version-info">
            <el-col :span="8">
              <img :src="img2" alt="">
              <p>
<!--                前端：{{ currentVersion.webFrontendVersion || '-' }}-->
                前端：{{ version }}
              </p>
            </el-col>
            <el-col :span="8">
              <img :src="img1" alt="">
              <p class="text-center">
                后端：{{ currentVersion.webBackendVersion || '-' }}
              </p>
            </el-col>
            <el-col :span="8">
              <img :src="img3" alt="">
              <p class="text-center">
                引擎端：{{ currentVersion.engineVersion || '-' }}
              </p>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="common-bg">
          <div class="common-header">
            知识库版本
          </div>
          <el-row class="common-body version-info">
            <el-col :span="8">
              <img :src="img1" alt="">
              <p class="text-center">
                组件库：{{ currentVersion.dbComponentVersion || '-' }}
              </p>
            </el-col>
            <el-col :span="8">
              <img :src="img2" alt="">
              <p>
                漏洞库：{{ currentVersion.dbVulVersion || '-' }}
              </p>
            </el-col>
            <el-col :span="8">
              <img :src="img3" alt="">
              <p class="text-center">
                许可证库：{{ currentVersion.dbLicenseVersion || '-' }}
              </p>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <Knowledge :list="$refs.history" v-if="authorityFilter(2252)"/>
    <History ref="history"/>
  </el-main>
</template>

<script>
import History from '@/views/home/system/update/history.vue'
import Knowledge from '@/views/home/system/update/knowledge.vue'
import img1 from '@/assets/images/system/icon_h.png'
import img2 from '@/assets/images/system/icon_q.png'
import img3 from '@/assets/images/system/icon_oss.png'
import { currentVersion } from '@/api/home/system/update'
import { VERSION } from '@/utils/conf'
export default {
  components: {
    History,
    Knowledge
  },
  data () {
    return {
      version: VERSION,
      vulSwitch: false,
      img1: img1,
      img2: img2,
      img3: img3,
      currentVersion: {
        webFrontendVersion: '',
        webBackendVersion: '',
        engineVersion: ''
      }
    }
  },
  methods: {
    // 获取当前版本号
    initCurrentVersion () {
      currentVersion({
        loading: false
      }).then(response => {
        this.currentVersion = response.data
      }).catch(error => {
        this.$message.error(error.message)
      })
    }
  },
  mounted () {
    this.initCurrentVersion()
  }
}
</script>

<style lang="scss" scoped>
.common-header {
  position: relative;

  .el-button {
    position: absolute;
    right: 30px;
  }
}

.common-body {
  padding: 75px 30px 30px;
  margin-bottom: 20px;
  text-align: center;
  box-sizing: border-box;
  height: 300px;

  &.version-info {
    color: #777;

    img {
      max-width: 80px;
    }
  }

  i {
    color: #9da2a6;
    font-size: 40px;
    outline: none;
    cursor: pointer;

    &:hover {
      color: #3ba3ff;
    }
  }
}
</style>
