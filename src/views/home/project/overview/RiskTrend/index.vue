<template>
  <div class="common-bg">
    <div class="common-header">
      风险趋势分析
      <div class="time-check">
        <span
          @click="init(7)"
          class="left-btn"
          :class="selectDays === 7 ? 'active' : ''"
        >近7日</span>
        <span
          @click="init(30)"
          class="right-btn"
          :class="selectDays === 30 ? 'active' : ''"
        >近30日</span>
      </div>
    </div>
    <stacked-line-chart
      :percentage="'1:0.3388'"
      :height="280"
      :chart-data="{
        label: ['组件', '漏洞', '许可证'],
        data: chartData
      }"
      :loading="loading"
    ></stacked-line-chart>
  </div>
</template>
<script>
import StackedLineChart from '@/components/chart/StackedLineChart.vue'
import {
  riskTrendLine
} from '@/api/home/overview'

export default {
  name: 'RiskTrend',
  components: {
    StackedLineChart
  },
  props: ['project'],
  data () {
    return {
      selectDays: 7,
      loading: false,
      chartData: []
    }
  },
  methods: {
    // 初始化折线图
    init (selectDays = 7) {
      this.selectDays = selectDays
      this.loading = true
      riskTrendLine({
        loading: false,
        projectId: this.project.id,
        dayNum: this.selectDays
      }).then(response => {
        this.loading = false
        const data = response.data
        this.chartData = []
        data.forEach(item => {
          this.chartData.push({
            value: [
              item.lineData.componentNum,
              item.lineData.vulNum,
              item.lineData.licenseNum
            ],
            name: item.date
          })
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
  margin-left: 9px;

  .active {
    background: #fff;
    border: 1px solid #8fc4f2;
    color: #8B5CF6;
  }

  span {
    font-size: 12px;
    display: inline-block;
    width: 52px;
    height: 26px;
    box-sizing: border-box;
    background: #f3f4f4;
    color: #999;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #f3f4f4;

    &:hover {
      background: rgba(30, 136, 229, 5%);
      border: 1px solid #8fc4f2;
      color: #8B5CF6;
    }
  }

  .left-btn {
    border-radius: 13px 2px 2px 13px;
    margin-right: 2px;
  }

  .right-btn {
    border-radius: 2px 13px 13px 2px;
  }
}
</style>
