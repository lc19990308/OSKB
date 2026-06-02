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
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, DataZoomComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer, DataZoomComponent])

export default {
  name: 'BarLineChart',
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
    centerLabel: {
      type: String,
      default: ''
    },
    legend: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
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
      color: [
        '',
        '#D9534F',
        '#D4932A',
        '#2C5F8A',
        '#48CDC5',
        '#4A9C8C'
      ]
    }
  },
  computed: {
    option () {
      const { label, data, xAxisLabel } = { label: ['总数', '高危', '中危', '低危', '信息'], data: [], xAxisLabel: '', ...this.chartData }
      const series = []
      const yAxis = []
      label.forEach((item, index) => {
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
        if (index === 0) {
          series.push({
            name: '总数',
            type: 'bar',
            yAxisIndex: 1,
            barWidth: 20,
            itemStyle: {
              color: '#7977d7'
            },
            label: {
              show: true,
              position: 'top',
              color: '#1B2838',
              fontSize: this.fontSize(0.14)
            },
            data: data.map(function (item) {
              return item.value[0]
            })
          })
        } else {
          series.push({
            name: item,
            type: 'line',
            symbolSize: 12,
            symbol: 'circle',
            yAxisIndex: 1,
            lineStyle: {
              width: 3,
              color: this.color[index]
            },
            itemStyle: {
              color: this.color[index],
              borderWidth: '2',
              borderColor: '#ffffff'
            },
            data: data.map(function (item) {
              return item.value[index]
            })
          })
        }
      })
      return {
        grid: {
          top: '19%',
          left: '5%',
          right: '8%',
          bottom: '9%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let res = params[0].name
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
        legend: {
          top: '5%',
          color: '#1B2838',
          fontSize: this.fontSize(0.12)
        },
        xAxis: [{
          name: xAxisLabel,
          nameLocation: 'end',
          nameTextStyle: {
            fontSize: this.fontSize(0.14),
            color: '#1B2838',
            align: 'left',
            padding: [20, 0, 0, -40]
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
        }],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
        yAxis: yAxis,
        series: series
      }
    },
    noData () {
      return Array.isArray(this.chartData) && this.chartData.length === 0
    }
  }
}
</script>
