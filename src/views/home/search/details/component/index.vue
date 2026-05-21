<template>
  <div>
<!--    <sticky :sticky-top="65" :sticky-class-name="'fixed-operating-wrap'">-->
<!--      <div class="clearfix">-->
<!--        <el-button size="medium" type="primary" @click="back">返回</el-button>-->
<!--      </div>-->
<!--    </sticky>-->
    <div class="view-content">
      <div class="headline" style="border: 0;padding: 0;">
        <img v-if="logoImg.get(componentInfo.packageManager)" :src="logoImg.get(componentInfo.packageManager)" alt="" style="vertical-align: middle;margin-right: 10px;">
        <span style="vertical-align: middle;">{{ componentInfo.projectName || '-' }}</span>
<!--        <level-tag :level="componentInfo.securityLevel"></level-tag>-->
      </div>
      <info-wrap>
        <info-row>
<!--          <info-item label="组件名称：" :span="8">{{ componentInfo.projectName || '-' }}</info-item>-->
<!--          <info-item label="组件版本：" :span="8">-->
<!--            <el-select v-model="componentInfo.version" :value-key="'version'" placeholder="组件版本" @change="changeVersion" size="medium">-->
<!--              <el-option-->
<!--                v-for="item in componentInfo.versionList"-->
<!--                :key="item"-->
<!--                :label="item"-->
<!--                :value="item">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </info-item>-->
          <info-item label="最新更新日期：" :span="8">{{ componentInfo.updateTime || '-' }}</info-item>
          <info-item label="发布厂商：" :span="8">{{ componentInfo.vendor || '-' }}</info-item>
<!--          <info-item label="组件许可证名：" :span="8">{{ componentInfo.licenseName || '-' }}</info-item>-->
        </info-row>
<!--        <info-row>-->
<!--        </info-row>-->
<!--        <info-row>-->
<!--          <info-item label="组件官方网站：" :span="24">-->
<!--            <span v-if="!componentInfo.homePage">-</span>-->
<!--            <el-link v-if="componentInfo.homePage" target="_blank" :underline="false" :href="componentInfo.homePage" type="primary">{{ componentInfo.homePage }}</el-link>-->
<!--          </info-item>-->
<!--        </info-row>-->
<!--        <info-row>-->
<!--          <info-item label="最新版本下载地址：" :label-width="150" :span="24">-->
<!--            <span v-if="!componentInfo.downloadUrl">-</span>-->
<!--            <el-link target="_blank" :underline="false" :href="componentInfo.downloadUrl" type="primary">{{ componentInfo.downloadUrl || '-' }}</el-link>-->
<!--          </info-item>-->
<!--        </info-row>-->
      </info-wrap>
      <el-row :gutter="20" class="chart-container">
        <el-col :span="12">
          <version-vul-chart  :chart-data="componentVersionVulLine" :loading="loading"></version-vul-chart>
        </el-col>
        <el-col :span="12">
          <version-release-chart :chart-data="componentVersionReleaseActivityLine" :loading="loading"></version-release-chart>
        </el-col>
      </el-row>
      <version-list :package-manager="packageManager" :id="id"></version-list>
    </div>
  </div>
</template>
<script>
import VersionVulChart from './VersionVulChart/index.vue'
import VersionReleaseChart from './VersionReleaseChart/index.vue'
import VersionList from './VersionList/index.vue'
import { componentDetail, componentOverview } from '@/api/home/search'
import mavenImg from '@/assets/images/maven.png'
import npmImg from '@/assets/images/npm.svg'
import cocoaPodsImg from '@/assets/images/CocoaPods.svg'
import nuGetImg from '@/assets/images/NuGet.svg'
import goImg from '@/assets/images/Go.png'
import pyPIImg from '@/assets/images/PyPI.png'
import composerImg from '@/assets/images/Composer.png'
import rubyGemsImg from '@/assets/images/RubyGems.svg'
import { isObject } from 'lodash-es'

export default {
  name: 'SearchComponentDetails',
  components: {
    VersionList,
    VersionVulChart,
    VersionReleaseChart
  },
  data () {
    return {
      logoImg: {
        1: mavenImg,
        2: pyPIImg,
        3: goImg,
        4: npmImg,
        5: nuGetImg,
        6: composerImg,
        7: rubyGemsImg,
        8: cocoaPodsImg,
        get: function (type) {
          if (type && Object.hasOwnProperty.call(this, type)) {
            return this[type]
          } else {
            return ''
          }
        }
      },
      mavenImg: mavenImg,
      id: this.$route.query.id,
      packageManager: this.$route.query.type,
      loading: false,
      componentInfo: {},
      componentVersionReleaseActivityLine: [],
      componentVersionVulLine: []
    }
  },
  methods: {
    //  返回
    back () {
      this.$router.push({
        path: '/search/main'
      })
    },

    // 初始化组件详情
    initComponentDetail () {
      this.componentInfo = {}
      componentDetail({
        id: this.id,
        packageManager: this.packageManager,
        loading: false
      }).then(response => {
        this.componentInfo = {
          ...response.data
        }
        // this.search()
      }).catch(error => {
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    },
    async getOverview () {
      const [error, response] = await to(componentOverview({
        id: this.id,
        packageManager: this.packageManager,
        loading: false
      }))

      if (isObject(error)) {
        return this.$message.error(error.message)
      }

      this.componentVersionReleaseActivityLine = get(response, ['data', 'componentVersionReleaseActivityLine'], [])
      this.componentVersionVulLine = get(response, ['data', 'componentVersionVulLine'], [])
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.packageManager = this.$route.query.type
      this.initComponentDetail()
      this.getOverview()
    }
  }
}
</script>
<style scoped lang="scss">
.chart-container {
  padding-bottom: 30px;

  .headline {
    margin-bottom: -36px;
  }
}
</style>
