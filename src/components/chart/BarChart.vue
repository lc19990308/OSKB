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
import { BarChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([BarChart, TooltipComponent, CanvasRenderer])

export default {
  name: 'BarChart',
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
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    option () {
      return {
        color: [
          '#8B1A1A',
          '#D9534F',
          '#D4932A',
          '#2C5F8A',
          '#5B8BA0'
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (x) {
            return '<div>' + x[0].name.replace(/[\r\n]/g, '') + '<br>' +
              '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + x[0].color + '"></span>' +
              '' + x[0].value + '<br>' + '</div>'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '20%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartData.map(function (i) {
              return i.name
            }),
            axisLine: {
              lineStyle: {
                color: '#f0f1f1'
              }
            },
            axisTick: {
              alignWithLabel: false
            },
            axisLabel: {
              interval: 0,
              color: '#1B2838',
              fontSize: this.fontSize(0.13)
            }
          }
        ],
        yAxis: [
          {
            minInterval: 1,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#f0f1f1'
              }
            },
            axisLabel: {
              color: '#1B2838',
              fontSize: this.fontSize(0.13)
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f0f1f1'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: this.chartData.length === 1 ? '5%' : '20%',
            label: {
              show: true,
              position: 'top',
              color: '#1B2838'
            },
            data: this.chartData.map(function (i) {
              return {
                name: i.name,
                value: i.value || 0,
                itemStyle: {
                  ...(color => color ? { color: color } : {})(i.color)
                }
              }
            })
          }
        ],
        label: {
          show: true,
          fontSize: this.fontSize(0.12),
          position: 'top',
          formatter: '{c}',
          color: '#1B2838'
        }
      }
    },
    noData () {
      return !(Array.isArray(this.chartData) && this.chartData.length > 0)
    }
  }
}
</script>
