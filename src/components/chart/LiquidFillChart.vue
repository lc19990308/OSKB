<template>
  <div class="chart-style">
    <chart
      :options="option"
      autoresize
      :percentage="percentage"
    ></chart>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import 'echarts-liquidfill'

echarts.use([CanvasRenderer])

export default {
  name: 'LiquidFillChart',
  components: {
    Chart
  },
  props: {
    percentage: {
      type: String,
      default () {
        return '1:1'
      }
    },
    chartData: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: false,
      default: '%'
    }
  },
  computed: {
    option () {
      const data = this.chartData
      return {
        series: [
          {
            name: '',
            type: 'liquidFill',
            radius: '90%',
            center: ['50%', '50%'],
            waveAnimation: 10, // 动画时长
            amplitude: 4, // 振幅
            data: [data > 0 ? (data / 100) : data],
            color: 'rgba(255,255,255,0.5)',
            label: {
              formatter: data > 0 ? (Number(data).toFixed(2) + this.unit) : '0' + this.unit,
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 'normal'
            },
            outline: {
              show: true,
              borderDistance: 0,
              itemStyle: {
                borderWidth: 4,
                borderColor: '#156ACF',
                shadowBlur: 0
              }
            },
            backgroundStyle: {
              color: 'rgba(30, 136, 229, 0.6)',
              borderWidth: 2,
              borderColor: '#ced4da'
            }
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-style {
  height: 70px;
  width: 70px;
}
</style>
