<template>
  <div class="common-bg">
    <div class="common-header">
      <svg class="common-header-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v18"/><path d="M6 4h14l-4 6 4 6H6"/></svg>
      许可证统计
    </div>
    <annulus-pie-chart
      :percentage="'1:0.478'"
      :legend="true"
      :height="280"
      :chart-data="{ data: chartData }"
      :loading="loading"
    ></annulus-pie-chart>
  </div>
</template>
<script>
import AnnulusPieChart from '../chart/AnnulusPieChart.vue'
import { licenseSecurityLevelPie } from '@/api/home/overview'

export default {
  name: 'VulPie',
  components: {
    AnnulusPieChart
  },
  props: ['project'],
  data () {
    return {
      loading: false,
      chartData: [
        {
          value: 0,
          name: '高风险',
          color: '#D9534F',
          key: 'highNum'
        },
        {
          value: 0,
          name: '中风险',
          color: '#D4932A',
          key: 'mediumNum'
        },
        {
          value: 0,
          name: '低风险',
          color: '#1a78cf',
          key: 'lowNum'
        }
      ]
    }
  },
  methods: {
    // 初始化许可证统计
    init () {
      this.loading = true
      licenseSecurityLevelPie({
        loading: false,
        projectId: this.project.id
      }).then(response => {
        this.loading = false
        const data = response.data
        this.chartData.forEach(item => {
          if (Object.hasOwnProperty.call(data, item.key)) {
            this.$set(item, 'value', data[item.key])
          }
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
