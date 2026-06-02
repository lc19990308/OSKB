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
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'
echarts.use([BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

export default {
  name: 'StackedRowBarChart',
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
    className: {
      type: String,
      default: 'chart'
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
      required: false
    },
    height: {
      type: Number,
      required: 0
    }
  },
  data () {
    return {
      color: [
        '#8B1A1A',
        '#D9534F',
        '#D4932A',
        '#1a78cf',
        '#4A9C8C'
      ],
      color2: [
        '#D9534F',
        '#48CDC5'
      ],
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    option () {
      const { data, rich, legend } = { data: [], rich: {}, legend: [], ...this.chartData }
      const series = []
      const richObject = {
        title: {
          color: '#4A5568',
          fontSize: this.fontSize(0.13)
        },
        index: {
          color: '#8B9CB0',
          width: 30,
          align: 'center',
          fontSize: 12
        }
      }
      if (Object.keys(rich).length > 0) {
        for (const i in rich) {
          if (Object.hasOwnProperty.call(rich, i)) {
            richObject['custom' + i] = {
              color: '#ffffff',
              align: 'left',
              padding: [2, 0, 0, 0],
              ...rich[i],
              width: Object.hasOwnProperty.call(rich[i], 'width') ? this.fontSize(rich[i].width / 100) : this.fontSize(0.16),
              height: Object.hasOwnProperty.call(rich[i], 'height') ? this.fontSize(rich[i].height / 100) : this.fontSize(0.16),
              fontSize: this.fontSize(0.12)
            }
          }
        }
      } else {
        this.color.forEach((x, y) => {
          rich['label' + y] = {
            color: '#fff',
            backgroundColor: x,
            width: this.fontSize(0.16),
            height: this.fontSize(0.16),
            align: 'left',
            fontSize: this.fontSize(0.12)
          }
        })
      }
      legend.forEach((item, index) => {
        series.push({
          name: item,
          type: 'bar',
          stack: true,
          label: {
            position: 'top',
            color: '#1B2838'
          },
          barMaxWidth: 6,
          // itemStyle: {
          //   borderRadius: 5
          // },
          data: data.map((item) => {
            return {
              itemStyle: {
                borderRadius: legend.length === 1 ? 5 : index === 0 ? [5, 0, 0, 5] : index === legend.length - 1 ? [0, 5, 5, 0] : 0
              },
              value: item.value[index],
              id: item.id
            }
          })
        })
      })
      return {
        color: this.color2,
        legend: {
          right: 16,
          top: 15,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 17,
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
          data: legend.map((item) => {
            return {
              name: item
            }
          })
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              opacity: 0
            },
            label: {
              formatter: (value) => {
                if (value.axisIndex !== 0) {
                  return '{value}'
                }
                const val = `${value.value.match(/{title\|(.*)}/) ? value.value.match(/{title\|(.*)}/)[1] : ''}`
                return val || value.value
              }
            }
          }
        },
        grid: {
          left: 120,
          right: 60,
          top: 50,
          bottom: '5%'
        },
        yAxis: [
          {
            inverse: true,
            type: 'category',
            data: data.map(item => {
              return {
                value: item.name,
                textStyle: {
                  rich: richObject
                }
              }
            }),
            axisLine: {
              show: false,
              lineStyle: {
                color: '#f0f1f1'
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            },
            axisLabel: {
              margin: -110,
              fontSize: 13,
              align: 'left',
              inside: true,
              color: '#1B2838',
              rich: richObject,
              axisLabel: 'inside',
              formatter: (val) => {
                if (!val) {
                  return ''
                }
                const match = val.match(/{title\|(.*)}/)
                let value = val
                if (match && match.length && match.length >= 2) {
                  value = val.match(/{title\|(.*)}/)[1]
                }
                if (value.length > 8) {
                  value = val.replace(value, value.slice(0, 8) + '...')
                } else {
                  value = val
                }
                return value
              }
            }
          },
          {
            inverse: true,
            type: 'category',
            data: data.map(item => {
              return {
                value: item.value.join('/')
              }
            }),
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#8B9CB0',
              fontSize: this.fontSize(0.12),
              margin: 10,
              align: 'left'
            }
          }
        ],
        xAxis: [
          {
            type: 'value',
            minInterval: 1,
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#f0f1f1'
              }
            },
            axisLabel: {
              show: false,
              color: '#1B2838',
              fontSize: this.fontSize(0.13)
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#f0f1f1'
              }
            }
          }
        ],
        series: series,
        ...this.options
      }
    },
    noData () {
      const { data } = { data: [], ...this.chartData }
      return !(Array.isArray(data) && data.length > 0)
    }
  }
}
</script>
