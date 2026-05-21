<template>
  <chart
    :loading="loading"
    :options="option"
    autoresize
    :fixedHeight="fixedHeight"
    :percentage="percentage"
    :no-data="noData"
  ></chart>
</template>

<script>
import * as echarts from 'echarts'
import { BarChart, LineChart } from 'echarts/charts'
import { TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([BarChart, LineChart, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'LineChart',
  mixins: [chartMixins],
  components: {
    Chart
  },
  props: {
    percentage: {
      type: String,
      default () {
        return '1:0.58'
      }
    },
    fixedHeight: {
      type: Number,
      default () {
        return 0
      }
    },
    chartData: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    option () {
      const data = this.chartData
      return {
        color: ['#8B5CF6'],
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#bbbbbb'
            }
          }
        },
        grid: {
          top: '18%',
          left: '30',
          right: '30',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            nameLocation: 'end',
            nameTextStyle: {
              color: '#333',
              align: 'left',
              padding: [20, 0, 0, -10]
            },
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#edeeee'
              }
            },
            axisLabel: {
              color: '#333333',
              margin: 15,
              fontSize: this.fontSize(0.12),
              // rotate: '45',
              formatter: function (item) {
                if (item.length > 6) {
                  return item.substr(0, 6) + '...'
                } else {
                  return item
                }
              }
            },
            axisTick: { show: false },
            data: data.map(function (item) {
              return item.name
            })
          }
        ],
        yAxis: [
          {
            type: 'value',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#edeeee'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#edeeee',
                type: 'dashed'
              }
            },
            axisLabel: {
              color: '#333333',
              formatter: '{value}',
              fontSize: this.fontSize(0.12)
            }
          }
        ],
        series: [
          {
            type: 'line',
            // smooth: true,
            symbolSize: 10,
            symbol: 'circle',
            lineStyle: {
              color: '#8B5CF6'
            },
            // areaStyle: {
            //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 0, color: 'rgba(30, 136, 229, 0.8)' },
            //     { offset: 1, color: 'rgba(30, 136, 229, 0.1)' }
            //   ], false),
            //   shadowColor: 'rgba(53,142,215, 0.9)',
            //   shadowBlur: 20
            // },
            data: data.map(function (item) {
              return item.value
            })
          }
        ]
      }
    },
    noData () {
      return Array.isArray(this.chartData) && this.chartData.length === 0
    }
  }
}
</script>
