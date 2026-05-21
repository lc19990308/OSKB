<template>
  <div class="common-bg">
    <div class="common-header">
      组件统计
    </div>
    <stacked-bar-chart
      :loading="loading"
      :height="280"
      :chart-data="{
              stack: true,
              label: ['严重', '高危', '中危', '低危', '无漏洞'],
              data: chartData,
              xAxisLabel: '类型'
            }"
      :options="options"
    ></stacked-bar-chart>
  </div>
</template>
<script>
import StackedBarChart from '@/components/chart/StackedBarChart.vue'
import { componentLevelChart } from '@/api/home/scan/develop/repository/git'
import { gitList } from '@/api/home/scan/develop/repository/git/batchAdd/warehouse'

export default {
  name: 'ComponentChart',
  components: {
    StackedBarChart
  },
  props: ['project'],
  data () {
    return {
      loading: false,
      options: {
        grid: {
          top: '25%',
          left: 60,
          right: 50,
          bottom: 40
        }
      },
      chartData: []
    }
  },
  methods: {
    // 初始化
    async init (auto) {
      if (!this.authorityFilter(2302)) {
        return 0
      }
      if (this.project === null) {
        return 0
      }
      if (!auto) {
        this.loading = true
      }
      componentLevelChart({
        projectId: this.project.id,
        loading: false,
        type: 1
      }).then(response => {
        const data = response.data
        this.loading = false

        this.chartData.forEach(item => {
          const x = data.find(item2 => item.key === item2.gitServerType)
          item.value = [
            get(x, 'componentNumVO.serious', 0),
            get(x, 'componentNumVO.high', 0),
            get(x, 'componentNumVO.medium', 0),
            get(x, 'componentNumVO.low', 0),
            get(x, 'componentNumVO.normal', 0)
          ]
        })
      }).catch(error => {
        if (typeof error === 'object') {
          this.loading = false
          this.$message.error(error.message)
        }
      })
    },
    // 获取git仓库类型
    gitList () {
      gitList().then(response => {
        this.chartData = response.data.map(item => {
          return {
            value: [0, 0, 0, 0, 0],
            name: item.name,
            key: item.code
          }
        })
      }).catch(error => {
        if (error && error.message) {
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
  async mounted () {
    if (this.project !== null) {
      await this.gitList()
      await this.init()
    }
  }
}
</script>
