<template>
  <div class="common-bg">
    <div class="common-header">
      版本发布活跃度
    </div>
    <line-chart
      :fixed-height="300"
      :percentage="'1:0.4'"
      :chart-data="data"
      :loading="loading"
    ></line-chart>
  </div>
</template>
<script>
import LineChart from '@/components/chart/LineChart.vue'
export default {
  name: 'VersionVulChart',
  components: {
    LineChart
  },
  props: {
    chartData: {
      type: Array,
      default () {
        return []
      }
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    data () {
      return this.chartData.map(item => {
        return {
          name: item.year,
          value: item.num
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.common-bg {
  box-shadow: 0 1px 8px 0 rgba(43, 117, 183, 30%);
}
</style>
