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
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([PieChart, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'PieChart',
  mixins: [chartMixins],
  components: {
    Chart
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      color: [
        '#8B1A1A',
        '#D9534F',
        '#D4932A',
        '#1a78cf',
        '#4A9C8C'
      ]
    }
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
    chartData: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    legend: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    option () {
      const data = this.chartData.map(item => {
        if (Object.hasOwnProperty.call(item, 'color')) {
          item.itemStyle = {
            color: item.color
          }
        }
        return item
      })
      const color = [
        '#8B1A1A',
        '#D9534F',
        '#D4932A',
        '#1a78cf',
        '#4A9C8C'
      ]
      return {
        color: color,
        tooltip: {
          formatter: function (x) {
            return '<div>' + x.name + '<br>' + x.value + '</div>'
          }
        },
        legend: {
          icon: 'circle',
          show: this.legend,
          fontSize: this.fontSize(0.14),
          type: 'scroll',
          orient: 'vertical',
          right: '25%',
          top: 'center',
          itemGap: 10
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            left: this.legend ? '-25%' : '',
            center: ['50%', '55%'],
            startAngle: 60,
            label: {
              show: !this.legend,
              position: !this.legend ? 'outside' : 'inside',
              fontSize: this.fontSize(0.13),
              lineHeight: this.fontSize(0.1),
              formatter: (x) => {
                return this.legend ? x.value : (x.name + ':' + x.value)
              },
              borderWidth: this.fontSize(0.1),
              borderRadius: 4
            },
            labelLine: {
              show: !this.legend,
              lineStyle: {
                type: 'solid'
              }
            },
            itemStyle: {
              borderWidth: 1,
              borderColor: '#fff'
            },
            data: data
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
