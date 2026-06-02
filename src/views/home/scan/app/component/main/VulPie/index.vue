<template>
  <div class="common-bg">
    <div class="common-header">
      漏洞等级统计
    </div>
    <annulus-pie-chart
      :legend="true"
      :height="280"
      :legend-conf="{
        orient: 'vertical',
        top: 'center'
      }"
      :center-label="'漏洞数'"
      :chart-data="chartData"
      :loading="loading"
    ></annulus-pie-chart>
  </div>
</template>
<script>
import {
  taskVulLevelNumChart
} from '@/api/home/scan/app/index.js'
import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'

export default {
  name: 'ComponentPie',
  components: {
    AnnulusPieChart
  },
  props: ['project'],
  data () {
    return {
      loading: false,
      chartData: {
        data: [
          {
            value: 0,
            name: '严重',
            color: '#8B1A1A',
            key: 'seriousCount'
          },
          {
            value: 0,
            name: '高危',
            color: '#D9534F',
            key: 'highCount'
          },
          {
            value: 0,
            name: '中危',
            color: '#D4932A',
            key: 'mediumCount'
          },
          {
            value: 0,
            name: '低危',
            color: '#1a78cf',
            key: 'lowCount'
          },
          {
            value: 0,
            name: '无漏洞',
            color: '#4A9C8C',
            key: 'normalCount'
          }
        ],
        sum: 0
      }
    }
  },
  methods: {
    // 初始化
    init (auto) {
      if (!this.authorityFilter(901)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (!auto) {
        this.chartData.data.forEach(item => {
          item.value = 0
        })
        this.chartData.sum = 0
        this.loading = true
      }
      taskVulLevelNumChart({
        projectId: this.project.id,
        loading: false
      }).then(response => {
        this.loading = false
        const data = response.data
        this.chartData.data.forEach(item => {
          item.value = data[item.key] || 0
        })
        this.chartData.sum = data.totalCount
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
      if (n !== null) {
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
