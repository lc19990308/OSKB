<template>
  <div class="common-bg" style="box-shadow: none;">
    <div class="common-header">
      漏洞统计
    </div>
    <annulus-pie-chart
      :center-label="'漏洞数'"
      :height="220"
      :legend="true"
      :legendConf="{ left: 'center' }"
      :chart-data="chartData"
      :loading="loading"
    ></annulus-pie-chart>
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
            color: '#8B1A1A',
            key: 'serious'
          },
          {
            value: 0,
            name: '高危',
            color: '#D9534F',
            key: 'high'
          },
          {
            value: 0,
            name: '中危',
            color: '#D4932A',
            key: 'medium'
          },
          {
            value: 0,
            name: '低危',
            color: '#1a78cf',
            key: 'low'
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
