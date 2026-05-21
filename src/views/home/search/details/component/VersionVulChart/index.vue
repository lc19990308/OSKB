<template>
  <div class="common-bg">
    <div class="common-header" >
      版本漏洞分布
    </div>
    <stacked-line-chart
      :percentage="'1:0.4'"
      :chart-data="{
      label: ['总数','严重', '高危', '中危', '低危'],
      data: data,
      areaShow: false
    }"
      :loading="loading"
    ></stacked-line-chart>
  </div>
</template>
<script>
import StackedLineChart from './StackedLineChart.vue'
export default {
  name: 'VersionVulChart',
  components: {
    StackedLineChart
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
  data () {
    return {
    }
  },
  computed: {
    data () {
      return this.chartData.map(item => {
        const { version, vulNumVO } = item
        return {
          name: version,
          value: [
            vulNumVO.total,
            vulNumVO.serious,
            vulNumVO.high,
            vulNumVO.medium,
            vulNumVO.low
          ]
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
