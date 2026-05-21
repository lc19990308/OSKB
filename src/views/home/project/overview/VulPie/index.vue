<template>
  <div class="common-bg">
    <div class="common-header">
      漏洞统计
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
import { vulSecurityLevelPie } from '@/api/home/overview'

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
          name: '严重',
          color: '#991B1B',
          key: 'seriousCount'
        },
        {
          value: 0,
          name: '高危',
          color: '#EF4444',
          key: 'highCount'
        },
        {
          value: 0,
          name: '中危',
          color: '#F59E0B',
          key: 'mediumCount'
        },
        {
          value: 0,
          name: '低危',
          color: '#1a78cf',
          key: 'lowCount'
        }
      ]
    }
  },
  methods: {
    // 初始化
    init () {
      this.loading = true
      vulSecurityLevelPie({
        loading: false,
        projectId: this.project.id
      }).then(response => {
        this.loading = false
        const data = response.data
        this.chartData.forEach(item => {
          if (Object.hasOwnProperty.call(data, item.key)) {
            item.value = data[item.key]
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
