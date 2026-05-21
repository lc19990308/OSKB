<template>
  <chart
    :loading="loading"
    :fixed-height="height"
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
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([PieChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'PieChart',
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
    legendConf: {
      type: Object,
      default () {
        return {}
      }
    },
    centerLabel: {
      type: [String, Boolean],
      default: ''
    },
    height: {
      type: Number,
      default () {
        return 0
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
      const { data, sum } = this.chartData
      return {
        tooltip: {
          trigger: 'item',
          formatter: (param) => {
            return `${param.marker}${param.name}<br />个数：${param.value}<br />占比：${param.percent}%`
          }
        },
        legend: {
          orient: 'vertical',
          left: '65%',
          icon: 'circle',
          top: 'center',
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 10,
          textStyle: {
            fontSize: 12,
            color: '#333333'
          },
          data
        },
        series: [
          {
            type: 'pie',
            center: ['40%', '47%'],
            radius: ['0%', '25%'],
            startAngle: [90],
            label: {
              show: true,
              position: 'center',
              color: '#333333',
              formatter: (x) => {
                return `{data|${x.value}}\n{title|${x.name}}`
              },
              rich: {
                data: {
                  fontSize: 30,
                  color: '#333333',
                  lineHeight: 40,
                  fontWeight: 'bold'
                },
                title: {
                  color: '#666666',
                  fontSize: 12
                }
              }
            },
            itemStyle: {
              color: 'rgba(0,0,0,0)'
            },
            data: [
              {
                value: sum,
                name: this.centerLabel
              }
            ]
          },
          {
            type: 'pie',
            radius: ['47%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data.map(item => ({
              ...item,
              itemStyle: {
                color: item.color
              }
            }))
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
