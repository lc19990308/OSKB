<template>
  <div class="common-bg">
    <div class="common-header">
      <svg class="common-header-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M7.8 7.8l2.1 2.1M14.1 14.1l2.1 2.1M7.8 16.2l2.1-2.1M14.1 9.9l2.1-2.1"/></svg>
      风险项目TOP10
    </div>
    <stacked-bar-chart
      :options="options"
      :height="280"
      :chart-data="{
              stack: true,
              label: ['组件数', '漏洞数', '许可证数'],
              data: chartData,
            }"
      :percentage="'1:0.3388'"
      :loading="loading"
    ></stacked-bar-chart>
  </div>
</template>
<script>
import StackedBarChart from '@/components/chart/StackedBarChart.vue'

import {
  riskProjectBar
} from '@/api/home/overview'

export default {
  name: 'RiskProject',
  components: {
    StackedBarChart
  },
  props: ['project'],
  data () {
    return {
      options: {
        color: [
          '#2C5F8A',
          '#5B8BA0',
          '#ff7059'
        ]
      },
      loading: false,
      chartData: []
    }
  },
  methods: {
    // 初始化风险项目TOP10柱形图
    init () {
      this.loading = true
      riskProjectBar({
        loading: false,
        projectId: this.project.id
      }).then(response => {
        this.loading = false
        const data = response.data.riskProjectList
        this.chartData = []
        data.forEach(item => {
          this.chartData.push({
            value: [
              item.riskComponentNum,
              item.riskVulNum,
              item.riskLicenseNum
            ],
            name: item.projectName
          })
        })
      }).catch(error => {
        this.loading = false
        if (typeof error === 'object') {
          this.$message.error(error.message)
        }
      })
    }
  },
  watch: {
    'project' (n) {
      if (n) {
        this.init()
      }
    }
  },
  mounted () {
    if (this.project) {
      this.init()
    }
  }
}
</script>
