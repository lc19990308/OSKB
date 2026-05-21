<template>
  <div class="common-bg">
    <div class="common-header">
      风险组件TOP10
    </div>
    <stacked-row-bar-chart
      :loading="loading"
      :height="400"
      :chart-data="{
        stack: true,
        legend: ['漏洞数', '影响项目'],
        data: chartData,
      }"
      :percentage="'1:0.644'"
    ></stacked-row-bar-chart>
  </div>
</template>
<script>
import StackedRowBarChart from './StackedRowBarChart.vue'
import { riskComponentBar } from '@/api/home/overview'

export default {
  name: 'ComponentTop',
  components: {
    StackedRowBarChart
  },
  props: ['project'],
  data () {
    return {
      loading: false,
      chartData: []
    }
  },
  methods: {
    // 初始化
    init () {
      this.loading = true
      riskComponentBar({
        loading: false,
        projectId: this.project.id
      }).then(response => {
        this.loading = false
        const data = response.data
        this.chartData = []
        data.forEach((item, index) => {
          this.chartData.push({
            value: [item.vulNumVO.total, item.affectedProjectNum],
            name: `{index|${index + 1}} {title|${item.componentName}：${item.componentVersion}}`
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
    if (this.project !== null) {
      this.init()
    }
  }
}
</script>
