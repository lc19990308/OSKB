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
import { TreeChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([TreeChart, TooltipComponent, CanvasRenderer])

export default {
  name: 'DependTreeChart',
  mixins: [chartMixins],
  components: {
    Chart
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      color: [
        {
          label: '严重',
          color: '#991B1B'
        },
        {
          label: '高危',
          color: '#EF4444'
        },
        {
          label: '中危',
          color: '#F59E0B'
        },
        {
          label: '低危',
          color: '#8B5CF6'
        },
        {
          label: '无漏洞',
          color: '#10B981'
        }
      ]
    }
  },
  props: {
    percentage: {
      type: String,
      default () {
        return '1:0.4'
      }
    },
    className: {
      type: String,
      default: 'chart'
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
  computed: {
    rich () {
      const rich = {
        default: {
          backgroundColor: '#ffffff',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          color: '#333333',
          padding: [4, 4, 4, 4],
          borderRadius: 2,
          borderWidth: 1,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 4
        }
      }
      this.color.forEach((item, index) => {
        rich[index + ''] = {
          backgroundColor: item.color,
          // backgroundColor: '#ffffff',
          color: '#ffffff',
          // color: item,
          padding: [4, 4, 4, 4],
          borderColor: item.color,
          borderRadius: 2,
          // borderWidth: 1,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 4
        }
      })
      return rich
    },
    option () {
      const data = this.chartData
      const legendData = this.color.map(item => {
        return {
          name: item.label,
          icon: 'round',
          itemStyle: {
            color: item.color
          }
        }
      })
      return {
        legend: {
          // right: '5%',
          // orient: 'vertical',
          show: true,
          selectedMode: false,
          data: legendData
        },
        series: [
          ...this.color.map(item => {
            return {
              name: item.label,
              type: 'tree'
            }
          }),
          {
            roam: true,
            type: 'tree',
            top: '12%',
            left: '12%',
            right: '12%',
            bottom: '12%',
            data: data,
            // orient: 'vertical',
            // edgeShape: 'polyline',
            symbol: 'circle',
            label: {
              rich: this.rich,
              backgroundColor: '#ffffff',
              color: '#333333',
              formatter (va) {
                return '{default|{b}}'
              }
            },
            lineStyle: {
              color: 'rgb(0,0,0, .1)'
            },
            emphasis: {
              focus: 'ancestor',
              blurScope: 'coordinateSystem',
              itemStyle: {
                color: 'rgba(0,0,0,0)'
              }
            }
          }
        ]
      }
    },
    noData () {
      return this.chartData.length === 0
    }
  }
}
</script>
