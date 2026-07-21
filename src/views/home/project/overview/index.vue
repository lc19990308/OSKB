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
            <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3M7.8 7.8l2.1 2.1M14.1 14.1l2.1 2.1M7.8 16.2l2.1-2.1M14.1 9.9l2.1-2.1"/>
            </svg>
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
            <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="5" r="3"/>
              <path d="M12 8v10"/>
              <path d="M8 18l4-4 4 4"/>
              <path d="M5 13h14"/>
            </svg>
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
            <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 21h8"/>
              <path d="M10 21V3l4-1v19"/>
              <path d="M10 8h4"/>
              <path d="M10 12h4"/>
              <circle cx="12" cy="4" r="2" fill="currentColor" stroke="none"/>
            </svg>
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
            <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 3v18"/>
              <path d="M6 4h14l-4 6 4 6H6"/>
            </svg>
          </div>
        </div>
      </el-col>
    </el-row>
    <section class="acceptance-section">
      <div class="acceptance-indicators">
        <article
          v-for="indicator in acceptanceIndicators"
          :key="indicator.name"
          :class="['acceptance-indicator', `acceptance-indicator--${indicator.tone}`]">
          <p class="acceptance-indicator__name">{{ indicator.name }}</p>
          <strong class="acceptance-indicator__value">{{ indicator.value }}</strong>
        </article>
      </div>
    </section>
    <div class="ship-divider">
      <span class="divider-line"></span>
      <svg class="divider-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M7.8 7.8l2.1 2.1M14.1 14.1l2.1 2.1M7.8 16.2l2.1-2.1M14.1 9.9l2.1-2.1"/></svg>
      <span class="divider-line"></span>
    </div>
    <el-row :gutter="20" class="wrap">
      <el-col :span="12">
        <div class="chart-block chart-risk-trend">
          <risk-trend :project="project"></risk-trend>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-block chart-risk-project">
          <risk-project :project="project"></risk-project>
        </div>
      </el-col>
    </el-row>
    <div class="ship-divider">
      <span class="divider-line"></span>
      <svg class="divider-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v10"/><path d="M8 18l4-4 4 4"/><path d="M5 13h14"/></svg>
      <span class="divider-line"></span>
    </div>
    <el-row :gutter="20" class="wrap">
      <el-col :span="8">
        <div class="chart-block chart-component-pie">
          <component-pie :project="project"></component-pie>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-block chart-vul-pie">
          <vul-pie :project="project"></vul-pie>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-block chart-license-pie">
          <license-pie :project="project"></license-pie>
        </div>
      </el-col>
    </el-row>
    <div class="ship-divider">
      <span class="divider-line"></span>
      <svg class="divider-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v18"/><path d="M6 4h14l-4 6 4 6H6"/></svg>
      <span class="divider-line"></span>
    </div>
    <el-row :gutter="20" class="wrap">
      <el-col :span="8"  :style="{marginBottom:'0px'}">
        <div class="chart-block chart-component-top">
          <component-top :project="project"></component-top>
        </div>
      </el-col>
      <el-col :span="8"  :style="{marginBottom:'0px'}">
        <div class="chart-block chart-vul-top">
          <vul-top :project="project"></vul-top>
        </div>
      </el-col>
      <el-col :span="8"  :style="{marginBottom:'0px'}">
        <div class="chart-block chart-license-top">
          <license-top :project="project"></license-top>
        </div>
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
      },
      acceptanceIndicators: [
        { name: '软件库', value: '42万', tone: 'ocean' },
        { name: '开源项目库', value: '3000万', tone: 'amber' },
        { name: '组件库', value: '1000万', tone: 'indigo' },
        { name: '版本库', value: '1亿', tone: 'brick' },
        { name: '代码特征库', value: '1.5TB', tone: 'plum' }
      ]
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

.acceptance-section {
  margin: 0 0 20px;
  padding: 0 0 20px;
  border-bottom: 1px solid var(--ossm-line);
}

.acceptance-indicators {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.acceptance-indicator {
  --indicator-color: var(--ossm-primary);
  --indicator-surface: #fffdf8;
  --indicator-line: #e7d6b5;

  box-sizing: border-box;
  min-height: 96px;
  border: 1px solid var(--indicator-line);
  border-top: 3px solid var(--indicator-color);
  border-radius: var(--ossm-radius);
  background: var(--indicator-surface);
  padding: 16px;

  &__name {
    margin: 0 0 12px;
    color: var(--ossm-muted);
    font-size: 13px;
    line-height: 1.4;
  }

  &__value {
    display: block;
    color: var(--indicator-color);
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
  }

  &--ocean {
    --indicator-color: #2d6f89;
    --indicator-surface: #f2f8fa;
    --indicator-line: #c8dee6;
  }

  &--amber {
    --indicator-color: #ae741c;
    --indicator-surface: #fff9ed;
    --indicator-line: #ebd5aa;
  }

  &--indigo {
    --indicator-color: #596b9d;
    --indicator-surface: #f5f6fc;
    --indicator-line: #d2d8eb;
  }

  &--brick {
    --indicator-color: #b35b47;
    --indicator-surface: #fdf5f2;
    --indicator-line: #eccdc4;
  }

  &--plum {
    --indicator-color: #815d7c;
    --indicator-surface: #faf5f9;
    --indicator-line: #e3cedd;
  }
}

@media (max-width: 1280px) {
  .acceptance-indicators {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .acceptance-indicators {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .acceptance-indicators {
    grid-template-columns: minmax(0, 1fr);
  }
}

.ship-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0 10px;
  opacity: 0.45;

  .divider-line {
    flex: 1;
    height: 2px;
    max-width: 60px;
    background: repeating-linear-gradient(
      90deg,
      #2C5F8A 0px,
      #2C5F8A 3px,
      transparent 3px,
      transparent 6px
    );
    border-radius: 1px;
  }

  .divider-icon {
    margin: 0 8px;
    color: #2C5F8A;
    flex-shrink: 0;
  }
}
</style>
