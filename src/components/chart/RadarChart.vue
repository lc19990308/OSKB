<template>
  <chart
    :loading="loading"
    :options="option"
    autoresize
    :percentage="percentage"
  ></chart>
</template>

<script>
import * as echarts from 'echarts'
import { RadarChart } from 'echarts/charts'
import { TooltipComponent, RadarComponent, LegendComponent, PolarComponent, AxisPointerComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([RadarChart, TooltipComponent, RadarComponent, LegendComponent, CanvasRenderer, PolarComponent, AxisPointerComponent])

export default {
  name: 'RadarChart',
  mixins: [chartMixins],
  components: {
    Chart
  },
  props: {
    centerLabel: {
      type: String,
      default: ''
    },
    percentage: {
      type: String,
      default () {
        return '1:0.58'
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
      const rank = ['安全', '信息', '低危', '中危', '高危']
      let indicator = []
      if (data.length > 0) {
        indicator = data.map(function (x) {
          return {
            min: 0,
            max: 4,
            name: x.name || '',
            axisLabel: null
          }
        })
      } else {
        indicator = [
          {
            min: 0,
            max: 4
          }
        ]
      }
      return {
        polar: {
          center: ['50%', '55%'],
          radius: '60%'
        },
        angleAxis: {
          interval: 30,
          startAngle: 0,
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              opacity: 0
            }
          },
          axisLabel: {
            show: true,
            color: '#ffffff'
          }
        },
        tooltip: {
          show: false,
          formatter (d) {
            let html = ''
            indicator.forEach(function (i, id) {
              html += '<div>' + i.name + '：' + rank[d.value[id]] + '</div>'
            })
            return html
          }
        },
        radiusAxis: {
          min: 0,
          max: 4,
          interval: 0,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#92b8ea'
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#92b8ea'
            }
          },
          axisLabel: {
            show: true,
            color: '#999',
            lineHeight: 15,
            padding: [0, 0, -45, 0],
            formatter: (x, index) => {
              return rank[index].split('').join('\n')
            },
            fontSize: 12
          },
          data: rank.map(_ => '')
        },
        radar: [
          {
            indicator: indicator,
            center: ['50%', '55%'],
            radius: '60%',
            startAngle: 90,
            splitNumber: 4,
            shape: 'circle',
            triggerEvent: true,
            silent: true,
            scale: true,
            axisNameGap: 9,
            axisName: {
              show: true,
              formatter: '{value}',
              color: '#333',
              fontSize: this.fontSize(0.14)
            },
            splitArea: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#92b8ea'
              }
            },
            axisTick: {
              show: true,
              length: 4
            },
            axisLabel: {
              show: true,
              color: '#fff'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#92b8ea'
              }
            }
          }
        ],
        series: [
          {
            name: '威胁分析',
            type: 'radar',
            areaStyle: {
              color: '#2371c7'
            },
            lineStyle: {
              color: '#2371c7',
              width: 3
            },
            data: data.length > 0 ? [
              {
                value: data.map(function (x) {
                  return x.value || 0
                }),
                symbolSize: 0
              }
            ] : []
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
