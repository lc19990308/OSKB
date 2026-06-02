<template>
  <div class="common-bg">
    <div class="common-header">
      <svg class="common-header-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v18"/><path d="M6 4h14l-4 6 4 6H6"/></svg>
      风险许可证TOP10
    </div>
    <stacked-row-bar-chart
      :height="400"
      :chart-data="{
          rich: rich,
          legend: ['影响组件','影响项目'],
          data: chartData,
        }"
      :loading="loading"
      :percentage="'1:0.644'"
    ></stacked-row-bar-chart>
  </div>
</template>
<script>
import StackedRowBarChart from './StackedRowBarChart.vue'
import { riskLicenseBar } from '@/api/home/overview'

export default {
  name: 'VulTop',
  components: {
    StackedRowBarChart
  },
  props: ['project'],
  data () {
    return {
      rich: {
        1: {
          name: '高风险',
          borderRadius: 3,
          width: 46,
          height: 16,
          lineHeight: 16,
          backgroundColor: '#D9534F'
        },
        2: {
          name: '中风险',
          borderRadius: 3,
          width: 46,
          height: 16,
          lineHeight: 16,
          backgroundColor: '#D4932A'
        },
        3: {
          name: '低风险',
          borderRadius: 3,
          width: 46,
          height: 16,
          lineHeight: 16,
          backgroundColor: '#1a78cf'
        }
      },
      loading: false,
      chartData: []
    }
  },
  methods: {
    // 初始化
    init () {
      this.loading = true
      riskLicenseBar({
        loading: false,
        projectId: this.project.id
      }).then(response => {
        this.loading = false
        const data = response.data
        this.chartData = []
        data.forEach((item, index) => {
          this.chartData.push({
            value: [item.affectedComponentNum, item.affectedProjectNum],
            name: `{index|${index + 1}}{custom${item.securityLevel}|${this.rich[item.securityLevel] ? this.rich[item.securityLevel].name : ''}} {title|${item.shortName}}`
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
