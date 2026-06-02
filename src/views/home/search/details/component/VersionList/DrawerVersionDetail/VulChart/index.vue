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
import { PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart/index.vue'
import { debounce } from '@/utils'
import { addListener, removeListener } from 'resize-detector'

echarts.use([PieChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'VulChart',
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
    chartData: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    legend: {
      type: Boolean,
      default: false
    },
    centerLabel: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    option () {
      const { data, sum } = this.chartData
      let _data = []
      if (Array.isArray(data)) {
        _data = data.map(x => {
          return {
            name: x.name,
            value: x.value,
            itemStyle: {
              color: x.color
            }
          }
        })
      }
      const safe = sum === '无漏洞' ? [
        {
          tooltip: {
            show: false
          },
          z: 8,
          name: 'safe',
          id: 'safe',
          type: 'pie',
          center: ['28%', '50%'],
          radius: ['61%', '81%'],
          startAngle: [224],
          label: {
            show: false
          },
          data: [
            {
              name: '无漏洞',
              value: 0,
              itemStyle: {
                color: '#4A9C8C'
              }
            }
          ]
        }
      ] : []
      return {
        color: this.color,
        tooltip: {
          show: true
        },
        series: [
          {
            name: 'center',
            id: 'legend2',
            type: 'pie',
            center: ['28%', '50%'],
            radius: ['0%', '25%'],
            startAngle: [90],
            tooltip: {
              show: false
            },
            label: {
              show: true,
              position: 'center',
              color: '#1B2838',
              formatter: (x) => {
                return `{data|${x.name}}\n{title|风险等级}`
              },
              rich: {
                data: {
                  fontSize: 24,
                  color: '#1B2838',
                  lineHeight: 40
                },
                title: {
                  color: '#1B2838',
                  fontSize: 14,
                  lineHeight: 25
                }
              }
            },
            itemStyle: {
              color: 'rgba(0,0,0,0)'
            },
            data: [
              {
                value: 0,
                name: sum
              }
            ]
          },
          {
            name: 'item',
            id: 'legend1',
            type: 'pie',
            center: ['28%', '50%'],
            radius: ['62%', '80%'],
            startAngle: [224],
            label: {
              show: false
            },
            emphasis: {
              scale: sum !== '无漏洞'
            },
            data: _data
          },
          ...safe
        ],
        legend: {
          show: true,
          id: 'legend1',
          right: 90,
          top: 'center',
          icon: 'circle',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 15,
          orient: 'vertical',
          textStyle: {
            fontSize: 14,
            color: '#1B2838',
            padding: [5, 0, 0, 10],
            rich: {
              num: {
                padding: [0, 0, 0, 15],
                fontSize: 16
              },
              label: {
                fontSize: 14
              }
            }
          },
          formatter: (item) => {
            let value = 0
            data.forEach(x => {
              if (x.name === item) {
                value = x.value
              }
            })
            return `${item}{num|${value}}`
          },
          data: data.map(item => {
            return {
              name: item.name
            }
          })
        }
      }
    },
    noData () {
      return Array.isArray(this.chartData) && this.chartData.length === 0
    }
  },
  methods: {
    init () {
      this.__resizeHandler = debounce(
        () => {
          this.windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        },
        100
      )
      addListener(this.$el, this.__resizeHandler)
    },
    fontSize (size) {
      if (!this.windowWidth) return
      const fontSize = 100 * (this.windowWidth / 1920)
      return size * fontSize
    }
  },
  mounted () {
    this.init()
  },
  destroy () {
    if (this.$el && this.__resizeHandler) {
      removeListener(this.$el, this.__resizeHandler)
    }
  }
}
</script>
