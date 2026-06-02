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
    }
  },
  data () {
    return {
      color: [
        '#8B1A1A',
        '#D9534F',
        '#D4932A',
        '#2C5F8A',
        '#2C5F8A',
        '#2C5F8A',
        '#2C5F8A',
        '#2C5F8A',
        '#2C5F8A',
        '#2C5F8A',
        '#2C5F8A'
      ],
      color2: [
        '#2C5F8A',
        '#5B8BA0'
      ],
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    option () {
      const { data, label } = { data: [], label: [], ...this.chartData }
      const series = []
      const rich = {}
      this.color.forEach((x, y) => {
        rich['nt' + y] = {
          color: '#fff',
          backgroundColor: x,
          width: this.fontSize(0.16),
          height: this.fontSize(0.16),
          align: 'center'
        }
        rich['title' + y] = {
          color: '#4A5568',
          width: this.fontSize(0.8),
          align: 'right'
        }
      })
      label.forEach((item, index) => {
        series.push({
          name: item,
          type: 'bar',
          stack: true,
          label: {
            position: 'top',
            color: '#1B2838'
          },
          barMaxWidth: data.length > 5 ? '12' : '50',
          borderRadius: '5',
          data: data.map((item) => {
            return {
              value: item.value[index],
              id: item.id
            }
          })
        })
      })
      return {
        color: this.color2,
        legend: {
          right: 13,
          top: '5%',
          symbol: '',
          itemWidth: this.fontSize(0.24),
          itemHeight: this.fontSize(0.14),
          itemGap: this.fontSize(0.10),
          textStyle: {
            fontSize: this.fontSize(0.12),
            color: '#1B2838'
          },
          data: label.map((item) => {
            return {
              name: item,
              icon: 'roundRect'
            }
          })
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              opacity: 0
            }
          }
        },
        grid: {
          // left: '159',
          left: this.fontSize(1.4),
          right: this.fontSize(0.6),
          // right: '60',
          top: '13%',
          bottom: '5%'
        },
        yAxis: [
          {
            inverse: true,
            type: 'category',
            data: data.map(item => item.name),
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
              margin: this.fontSize(1.2),
              fontSize: this.fontSize(0.13),
              align: 'left',
              color: '#1B2838',
              rich: rich,
              formatter: (val, index) => {
                let value = val
                const a = 8
                if (val.length > 8) {
                  value = val.slice(0, 8) + '...'
                }
                if (a > index) {
                  return [
                    '{nt' + index + '|' + (index + 1) + '}' + '  {title' + index + '|' + value + '}'
                  ].join('\n')
                } else {
                  return [
                    '{nt' + 3 + '|' + (index + 1) + '}' + '  {title' + 3 + '|' + value + '}'
                  ].join('\n')
                }
              }
            },
            splitLine: {
              show: false
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
