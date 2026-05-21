<template>
  <el-main class="main">
    <el-row :gutter="20" class="wrap">
      <el-col :span="6">
        <div
          class="common-bg card-sm card-sm-app cursor-pointer"
          @click="authorityFilter(500) ? $router.push('/scan/app') : void 0">
          <div class="card-main">
            <h4>应用包总数: </h4>
            <p>
              <span class="tag">统计</span>
              <count-to v-if="isNumber(form.appPackageTotal)" class="number" :startVal="0"
                        :endVal="form.appPackageTotal"
                        :duration="3000"></count-to>
              <span v-else class="number">-</span>
            </p>
          </div>
          <div class="card-icon">
            <i class="iconfont iconapplication"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div
          class="common-bg card-sm card-sm-component cursor-pointer"
          @click="authorityFilter(400) ? $router.push('/assets/module') : void 0">
          <div class="card-main">
            <h4>组件总数: </h4>
            <p>
              <span class="tag">统计</span>
              <count-to v-if="isNumber(form.componentTotal)" class="number" :startVal="0"
                        :endVal="form.componentTotal" :duration="3000"></count-to>
              <span v-else class="number">-</span>
            </p>
          </div>
          <div class="card-icon">
            <i class="iconfont iconcomponent"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div
          class="common-bg card-sm card-sm-vul cursor-pointer"
          @click="authorityFilter(1100) ? $router.push('/assets/vul') : void 0">
          <div class="card-main">
            <h4>漏洞总数: </h4>
            <p>
              <span class="tag">统计</span>
              <count-to v-if="isNumber(form.vulTotal)" class="number" :startVal="0" :endVal="form.vulTotal"
                        :duration="3000"></count-to>
              <span v-else class="number">-</span>
            </p>
          </div>
          <div class="card-icon">
            <i class="iconfont iconloudongku"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div
          class="common-bg card-sm card-sm-license cursor-pointer"
          @click="authorityFilter(700) ? $router.push('/assets/license') : void 0">
          <div class="card-main">
            <h4>许可证总数: </h4>
            <p>
              <span class="tag">统计</span>
              <count-to v-if="isNumber(form.licenseTotal)" class="number" :startVal="0" :endVal="form.licenseTotal"
                        :duration="3000"></count-to>
              <span v-else class="number">-</span>
            </p>
          </div>
          <div class="card-icon">
            <i class="iconfont iconpermission"></i>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="wrap">
      <el-col :span="12">
        <risk-trend :project="project"></risk-trend>
      </el-col>
      <el-col :span="12">
        <risk-project :project="project"></risk-project>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="wrap">
      <el-col :span="8">
        <component-pie :project="project"></component-pie>
      </el-col>
      <el-col :span="8">
        <vul-pie :project="project"></vul-pie>
      </el-col>
      <el-col :span="8">
        <license-pie :project="project"></license-pie>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="wrap">
      <el-col :span="8"  :style="{marginBottom:'0px'}">
        <component-top :project="project"></component-top>
      </el-col>
      <el-col :span="8"  :style="{marginBottom:'0px'}">
        <vul-top :project="project"></vul-top>
      </el-col>
      <el-col :span="8"  :style="{marginBottom:'0px'}">
        <license-top :project="project"></license-top>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>
import RiskTrend from './RiskTrend'
import RiskProject from './RiskProject'
import ComponentTop from './ComponentTop'
import VulTop from './VulTop'
import LicenseTop from './LicenseTop'
import LicensePie from './LicensePie'
import VulPie from './VulPie'
import ComponentPie from './ComponentPie'
import { projectSummary } from '@/api/home/overview'
import CountTo from 'vue-count-to'

export default {
  name: 'overview',
  components: {
    RiskTrend,
    RiskProject,
    ComponentTop,
    VulTop,
    LicenseTop,
    LicensePie,
    VulPie,
    ComponentPie,
    CountTo
  },
  data () {
    return {
      project: this.$store.state.home.project,
      loading: false,
      form: {
        appPackageTotal: null,
        componentTotal: null,
        vulTotal: null,
        licenseTotal: null
      }
    }
  },
  methods: {
    // 初始化汇总数据
    initData () {
      this.loading = true

      projectSummary({
        loading: false,
        projectId: this.project.id
      }).then(response => {
        const data = response.data
        this.form.appPackageTotal = data.appPackageTotal
        this.form.componentTotal = data.componentNumVO.total
        this.form.vulTotal = data.vulNumVO.total
        this.form.licenseTotal = data.licenseNumVO.totalNum
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }

  },
  watch: {
    '$store.state.home.project' (n) {
      if (n) {
        this.project = n
        this.initData()
      }
    }
  },
  mounted () {
    if (this.$store.state.home.project) {
      this.initData()
    }
  }
}
</script>
<style scoped lang="scss">
.wrap {
  .card-sm {
    padding: 14px 20px;
    transition: all 0.5s;

    &:hover {
      box-shadow: 0 2px 5px 0 rgba(30, 136, 229, 30%);
    }
  }

  .el-col {
    margin-bottom: 20px;
  }
}
</style>
