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
  name: 'RowBarChart',
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
    data: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 0
    },
    options: {
      type: Object,
      default () {
        return { }
      }
    }
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    option () {
      const data = this.data
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '11%',
          left: '10px',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#edeeee'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#edeeee'
            }
          },
          axisLabel: {
            color: '#1B2838',
            formatter: '{value}',
            fontSize: this.fontSize(0.14)
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#edeeee'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#edeeee'
            }
          },
          axisLabel: {
            show: true,
            color: '#1B2838',
            fontSize: this.fontSize(0.12),
            formatter: '{value}'
          }
        },
        series: [
          {
            barWidth: '20%',
            type: 'bar',
            data: data.map(item => ({
              value: item.value,
              itemStyle: {
                color: item.color
              }
            }))
          }
        ],
        ...this.options
      }
    },
    noData () {
      return this.data.length === 0
    }
  }
}
</script>
