<template>
  <chart
    :loading="loading"
    :options="option"
    autoresize
    :fixed-height="height"
    :percentage="percentage"
    :no-data="noData"
  ></chart>
</template>

<script>
import * as echarts from 'echarts'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'StackedBarChart',
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
    options: {
      type: Object,
      default () {
        return {}
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
    vertical: {
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
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    option () {
      const { data, label, stack, xAxisLabel } = { data: [], label: [], stack: false, xAxisLabel: '', ...this.chartData }
      let width = 0
      let displayNameLength = 0
      if (this.$el && data.length > 0) {
        width = this.$el.clientWidth
        const a = (width * 0.7) / data.length / 8
        displayNameLength = Math.floor(a)
        if (displayNameLength < 6) {
          displayNameLength = 6
        }
      }
      const series = []
      const color = [
        '#8B1A1A',
        '#D9534F',
        '#D4932A',
        '#1a78cf',
        '#4A9C8C'
      ]
      label.forEach((item, index, arr) => {
        series.push({
          name: item,
          type: 'bar',
          stack: stack === false ? false : '总量',
          label: {
            show: !stack,
            position: 'top',
            color: '#1B2838'
          },
          barMaxWidth: data.length > 5 ? '12' : '20',
          borderRadius: '5',
          data: data.map((item) => {
            const itemColor = {}
            if (arr[0] !== '严重') {
              itemColor.color = color[index + 1]
            }
            return {
              value: item.value[index],
              id: item.id,
              type: item.type,
              itemStyle: {
                borderWidth: 1,
                ...itemColor
              }
            }
          })
        })
      })
      return {
        color: color,
        legend: {
          right: 16,
          top: 15,
          // symbol: '',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 17,
          icon: 'circle',
          formatter: function (name) {
            return ['{name|' + name + '}']
          },
          textStyle: {
            fontSize: this.fontSize(0.12),
            color: '#1B2838',
            rich: {
              name: {
                verticalAlign: 'center',
                padding: [3, 0, 0, 0]
              }
            }
          },
          data: label.map((item, index, arr) => {
            const itemColor = {}
            if (arr[0] !== '严重') {
              itemColor.color = color[index + 1]
            }
            return {
              name: item,
              itemStyle: {
                borderWidth: 1,
                ...itemColor
              }
            }
          })
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#bbbbbb',
              type: 'solid'
            }
          }
        },
        grid: {
          top: '25%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        [this.vertical ? 'xAxis' : 'yAxis']: [
          {
            type: 'category',
            name: xAxisLabel,
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: this.fontSize(0.14),
              color: '#1B2838',
              align: 'left',
              padding: [27, 0, 0, -5]
            },
            interval: 1,
            data: data.map(item => item.name),
            axisTick: {
              alignWithLabel: true
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#edeeee',
                type: 'dashed'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                // width: 2,
                color: '#f4f5f5'
              }
            },
            axisLabel: {
              show: true,
              color: '#1B2838',
              fontSize: this.fontSize(0.12),
              // showMinLabel: null,
              showMaxLabel: true,
              interval: 0,
              formatter: function (item) {
                if (displayNameLength !== 0 && item.length > displayNameLength) {
                  return item.substring(0, displayNameLength) + '...'
                } else {
                  return item
                }
              }
            }
          }
        ],
        [!this.vertical ? 'xAxis' : 'yAxis']: [
          {
            type: 'value',
            minInterval: 1,
            lineStyle: {
              width: 2,
              color: '#f4f5f5'
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#edeeee',
                type: 'dashed'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                // width: 2,
                color: '#f4f5f5'
              }
            },
            axisLabel: {
              show: true,
              color: '#1B2838',
              fontSize: this.fontSize(0.12),
              formatter: '{value}'
            },
            max: data.length === 0 ? 100 : null,
            min: data.length === 0 ? 0 : null
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
        series: series,
        label: {
          show: true,
          fontSize: this.fontSize(0.12),
          position: 'top',
          formatter: (x) => {
            return x.value
          },
          color: '#dddddd'
        },
        ...this.options
      }
    },
    noData () {
      const { data } = { data: [], ...this.chartData }
      return Array.isArray(data) && data.length === 0
    }
  }
}
</script>
