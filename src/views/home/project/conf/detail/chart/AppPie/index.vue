<template>
  <div class="common-bg" style="box-shadow: none;">
    <div class="common-header">
      应用包统计
    </div>
    <annulus-pie-chart
      :legend="true"
      :legendConf="{ left: 'center' }"
      :center-label="'应用包数'"
      :height="220"
      :chart-data="chartData"
      :loading="loading"></annulus-pie-chart>
  </div>
</template>
<script>
import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'

export default {
  name: 'ComponentPie',
  components: {
    AnnulusPieChart
  },
  props: ['state'],
  data () {
    return {
      loading: false,
      chartData: {
        data: [
          {
            value: 0,
            name: '严重',
            color: '#991B1B',
            key: 'serious'
          },
          {
            value: 0,
            name: '高危',
            color: '#EF4444',
            key: 'high'
          },
          {
            value: 0,
            name: '中危',
            color: '#F59E0B',
            key: 'medium'
          },
          {
            value: 0,
            name: '低危',
            color: '#1a78cf',
            key: 'low'
          },
          {
            value: 0,
            name: '无漏洞',
            color: '#10B981',
            key: 'normal'
          }
        ],
        sum: 0
      }
    }
  },
  watch: {
    state: {
      immediate: true,
      handler (v) {
        this.chartData.data.forEach(item => {
          item.value = v[item.key] || 0
        })
        this.chartData.sum = v.total
      }
    }
  }
}
</script>
