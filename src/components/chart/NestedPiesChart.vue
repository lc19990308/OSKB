<template>
  <chart
    :loading="loading"
    :options="option"
    autoresizef
    :percentage="percentage"
    :no-data="noData"
  ></chart>
</template>

<script>
import * as echarts from 'echarts'
import { PieChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'
echarts.use([PieChart, TooltipComponent, CanvasRenderer])

export default {
  name: 'NestedPiesChart',
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
    centerLabel: {
      type: String,
      default: '资产总数'
    },
    legend: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
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
      const { sum, data } = { sum: 0, data: [], ...this.chartData }
      return {
        tooltip: {
          show: true
        },
        xAxis: [
          {
            type: 'category', show: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            type: 'pie',
            radius: ['0%', '35%'],
            startAngle: [90],
            label: {
              position: 'center',
              padding: [-20, 0, 0, 0],
              fontSize: this.fontSize(0.26),
              color: '#ffffff',
              lineHeight: '20',
              formatter: (x) => {
                return x.value + '个'
              }
            },
            data: [
              {
                value: sum,
                name: '总数',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 1, 0,
                    [
                      { offset: 0, color: '#1d86e2' },
                      { offset: 1, color: '#1360ad' }
                    ]
                  )
                }
              }
            ]
          },
          {
            type: 'pie',
            radius: ['0%', '35%'],
            startAngle: [90],
            label: {
              position: 'center',
              padding: [40, 0, 0, 0],
              fontSize: this.fontSize(0.14),
              color: '#ffffff',
              lineHeight: '20',
              formatter: (x) => {
                return this.centerLabel
              }
            },
            data: [
              {
                value: sum,
                name: '总数',
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            type: 'pie',
            radius: ['45%', '53%'],
            startAngle: [224],
            label: {
              position: 'outside',
              fontSize: this.fontSize(0.14),
              color: '#1B2838',
              lineHeight: 6,
              formatter: function (x) {
                return x.name + '：' + x.value + '个'
              },
              borderWidth: 6,
              borderRadius: 4
            },
            labelLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#1B2838'
              },
              length: 8,
              length2: 8
            },
            data: data.map(x => {
              return {
                name: x.name,
                value: x.value,
                itemStyle: {
                  color: x.color
                }
              }
            })
          }
        ]
      }
    },
    noData () {
      const { sum, data } = { sum: 0, data: [], ...this.chartData }
      return data.length === 0 && sum === undefined
    }
  }
}
</script>
