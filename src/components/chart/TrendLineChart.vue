<template>
  <chart
    :loading="loading"
    :options="option"
    autoresize
    :percentage="percentage"
    :no-data="noData"
  ></chart>
</template>

<script>
import * as echarts from 'echarts'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'
echarts.use([LineChart, TooltipComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'TrendLineChart',
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
    label: {
      type: Array,
      default () {
        return ['高危', '中危', '低危', '信息']
      }
    },
    legend: {
      type: Boolean,
      default: true
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
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      colorList: [
        '#D9534F',
        '#D4932A',
        '#2C5F8A',
        '#4A9C8C'
      ]
    }
  },
  computed: {
    option () {
      const data = this.chartData
      const color = this.colorList
      const series = []
      const yAxis = []
      this.label.forEach((item, index) => {
        yAxis.push({
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
              color: '#edeeee'
            }
          },
          axisLabel: {
            color: '#1B2838',
            formatter: '{value}',
            fontSize: this.fontSize(0.14)
          }
        })
        series.push({
          name: item,
          type: 'line',
          symbolSize: this.fontSize(0.14),
          symbol: 'circle',
          yAxisIndex: 1,
          lineStyle: {
            width: 3,
            color: color[index]
          },
          color: color[index],
          borderWidth: '2',
          borderColor: '#ffffff',
          data: data.map(function (item) {
            return item.value[index]
          })
        })
      })
      return {
        grid: {
          left: '5%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        color: this.color,
        tooltip: {
          trigger: 'axis',
          formatter: function (params, ticket, callback) {
            let res = ''
            res = params[0].name
            for (let i = 0, l = params.length; i < l; i++) {
              if (params[i].seriesType === 'line') {
                res += '<br/>' + params[i].seriesName + ' : ' + (params[i].value ? params[i].value : '0') + '个'
              } else {
                res += '<br/>' + params[i].seriesName + ' : ' + (params[i].value ? params[i].value : '0') + '个'
              }
            }
            return res
          }
        },
        xAxis: [
          {
            name: '',
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: this.fontSize(0.14),
              color: '#1B2838',
              align: 'left',
              padding: [20, 0, 40, 14 * (-2)]
            },
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#edeeee'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#edeeee'
              }
            },
            axisLabel: {
              color: '#1B2838',
              fontSize: this.fontSize(0.14)
            },
            data: data.map(function (item) {
              return item.name
            })
          }
        ],
        yAxis: yAxis,
        series: series,
        legend: {
          top: '5%',
          color: '#1B2838',
          fontSize: this.fontSize(0.14)
        }
      }
    },
    noData () {
      return Array.isArray(this.chartData) && this.chartData.length === 0
    }
  }
}
</script>
