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
  name: 'Pie',
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
    sum: {
      type: Number,
      default () {
        return 0
      }
    },
    title: {
      type: String,
      default () {
        return '1:0.58'
      }
    },
    height: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  computed: {
    option () {
      return {
        tooltip: {
          trigger: 'item'
        },
        color: ['#a80022', '#f64e60', '#fead33', '#3596fa', '#50cd89'],
        legend: {
          show: false
        },
        series: [
          {
            id: 'center',
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['50%', '60%'],
            startAngle: [90],
            label: {
              show: true,
              position: 'center',
              color: '#1B2838',
              formatter: (x) => {
                return `{data|${x.value}}\n{title|${x.name}}`
              },
              rich: {
                data: {
                  color: '#1B2838',
                  lineHeight: 27,
                  fontWeight: 'bold',
                  fontSize: '16px'
                },
                title: {
                  color: '#1B2838'
                }
              }
            },
            itemStyle: {
              fontWeight: 'bold',
              fontSize: '18px',
              color: 'rgba(0,0,0,0)'
            },
            data: [
              {
                value: this.sum,
                name: this.title
              }
            ]
          },
          {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: false,
              formatter: '{b} {c}个',
              fontSize: 14,
              lineHeight: 18,
              color: '#1B2838'
            },
            data: this.data.map((item) => {
              return {
                name: item.name,
                value: item.value
              }
            })
          }
        ]
      }
    },
    noData () {
      return Array.isArray(this.data) && this.data.length === 0
    }
  }
}
</script>
