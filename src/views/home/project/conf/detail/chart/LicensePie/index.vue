<template>
  <div class="common-bg" style="box-shadow: none;">
    <div class="common-header">
      许可证统计
    </div>
    <annulus-pie-chart
      :height="220"
      :legend="true"
      :center-label="'许可证数'"
      :legendConf="{ left: 'center' }"
      :chart-data="chartData"
      :loading="loading"
    ></annulus-pie-chart>
  </div>
</template>
<script>
import AnnulusPieChart from '@/components/chart/AnnulusPieChart.vue'

export default {
  name: 'VulPie',
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
        this.chartData.sum = v.totalNum
      }
    }
  }
}
</script>
