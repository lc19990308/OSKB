<template>
  <div class="common-bg">
    <div class="common-header">
      <svg class="common-header-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v10"/><path d="M8 18l4-4 4 4"/><path d="M5 13h14"/></svg>
      组件统计
    </div>
    <annulus-pie-chart
      :percentage="'1:0.476'"
      :legend="true"
      :height="280"
      :chart-data="{ data: chartData }"
      :loading="loading"
    ></annulus-pie-chart>
  </div>
</template>
<script>
import AnnulusPieChart from '../chart/AnnulusPieChart.vue'
import { componentSecurityLevelPie } from '@/api/home/overview'

export default {
  name: 'ComponentPie',
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
      ]
    }
  },
  methods: {
    // 初始化
    init () {
      this.loading = true
      componentSecurityLevelPie({
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
<style scoped lang="scss">
.time-check {
  display: inline-block;
  position: relative;
  z-index: 1;
  margin-left: 30px;
  font-size: 12px;

  .el-link {
    font-size: 12px;
  }
}
</style>
