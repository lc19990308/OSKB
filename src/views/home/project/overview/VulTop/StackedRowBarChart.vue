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
    type: {
      type: Number,
      default () {
        return 4
      }
    },
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
        '#991B1B',
        '#EF4444',
        '#F59E0B',
        '#1a78cf',
        '#10B981'
      ],
      color2: [
        '#8B5CF6',
        '#6366F1'
      ],
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    option () {
      const { rich, legend, ...value } = { data: [], rich: {}, legend: [], ...this.chartData }
      const arr = value.data
      if (this.type === 3) {
        for (let i = 0; i < arr.length - 1; i++) {
          // 内层循环,控制比较的次数，并且判断两个数的大小
          for (let j = 0; j < arr.length - 1 - i; j++) {
            // 白话解释：如果前面的数大，放到后面(当然是从小到大的冒泡排序)
            if (arr[j].level > arr[j + 1].level) {
              const temp = arr[j]
              arr[j] = arr[j + 1]
              arr[j + 1] = temp
            } else if (arr[j].level === arr[j + 1].level && arr[j].value[1] > arr[j + 1].value[1]) {
              const temp = arr[j]
              arr[j] = arr[j + 1]
              arr[j + 1] = temp
            }
          }
        }
      }
      const data = arr

      const series = []
      const richObject = {
        title: {
          color: '#666666',
          padding: [0, 0, 0, 5],
          fontSize: this.fontSize(0.13)
        },
        index: {
          color: '#999999',
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
              align: 'center',
              padding: [2, 0, 0, 0],
              width: 34,
              height: 16,
              fontSize: 12,
              ...rich[i]
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
            align: 'center',
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
            color: '#333333'
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
          right: 50,
          top: 15,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 17,
          formatter: function (name) {
            return ['{name|' + name + '}']
          },
          textStyle: {
            fontSize: 12,
            color: '#333333',
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
          className: 'echarts-tooltip',
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
                return val || '{value}'
              }
            }
          }
        },
        grid: {
          left: 165,
          right: this.type === 2 ? 100 : 90,
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
              margin: -155,
              fontSize: this.fontSize(0.13),
              align: 'left',
              inside: true,
              color: '#333',
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
              if (this.type === 4 || this.type === 3) {
                return {
                  value: item.value.join('/')
                }
              } else if (this.type === 1) {
                return {
                  value: '困难'
                }
              } else if (this.type === 2) {
                return {
                  value: '2022/03/10'
                }
              }
            }),
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#999999',
              fontSize: this.fontSize(0.12),
              margin: 20,
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
              color: '#333333',
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
