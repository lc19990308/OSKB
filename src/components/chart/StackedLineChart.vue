<template>
  <chart :loading="loading" :options="option" :fixed-height="height" autoresize :percentage="percentage" :no-data="noData"></chart>
</template>

<script>
import * as echarts from 'echarts'
import {
  BarChart,
  LineChart
} from 'echarts/charts'
import {
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components'
import {
  CanvasRenderer
} from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([BarChart, LineChart, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'StackedLineChart',
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
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      color: [
        '#D9534F',
        '#D4932A',
        '#2C5F8A',
        '#5B8BA0'
      ]
    }
  },
  computed: {
    option () {
      const {
        data,
        label,
        color,
        areaShow
      } = {
        data: [],
        label: [],
        color: this.color,
        areaShow: true,
        ...this.chartData
      }
      const series = []
      label.forEach((item, index) => {
        series.push({
          name: item,
          type: 'line',
          symbol: 'circle',
          symbolSize: 10,
          smooth: true,
          emphasis: {
            scale: true,
            itemStyle: {
              borderWidth: 2
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 4
          },
          label: {
            position: 'top',
            color: '#1B2838'
          },
          areaStyle: {
            opacity: areaShow ? 0.3 : 0,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: color[index]
              },
              {
                offset: 1,
                color: 'rgba(255,255,255,0)' // 100% 处的颜色
              }
              ],
              global: false // 缺省为 false
            }
          },
          data: data.map((x) => {
            return {
              value: x.value[index],
              id: x.id
            }
          })
        })
      })
      return {
        color: color,
        legend: {
          right: 16,
          top: 15,
          symbol: '',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 17,
          icon: 'circle',
          fontSize: this.fontSize(0.14),
          itemStyle: {
            borderWidth: 0
          },
          formatter: function (name) {
            return ['{name|' + name + '}']
          },
          textStyle: {
            rich: {
              name: {
                verticalAlign: 'center',
                padding: [3, 0, 0, 0]
              }
            }
          },
          data: label.map((item) => {
            return {
              name: item,
              color: '#4A5568'
            }
          })
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255)',
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
          right: '50px',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [{
          nameLocation: 'end',
          nameTextStyle: {
            color: '#1B2838',
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
            color: '#1B2838',
            margin: 15,
            showMaxLabel: true,
            fontSize: this.fontSize(0.12),
            formatter: function (item) {
              if (item.length > 12) {
                return item.substr(0, 12) + '...'
              } else {
                return item
              }
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#edeeee',
              type: 'dashed'
            }
          },
          data: data.map(function (item) {
            return item.name
          })
        }],
        yAxis: [{
          type: 'value',
          position: 'left',
          axisLine: {
            show: true,
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
            color: '#1B2838',
            formatter: '{value}',
            fontSize: this.fontSize(0.12)
          }
        }],
        series: series,
        ...this.options
      }
    },
    noData () {
      const { data } = { data: [], ...this.chartData }
      return data.length === 0
    }
  }
}

</script>
