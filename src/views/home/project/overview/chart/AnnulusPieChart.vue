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
import { PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'
echarts.use([PieChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'AnnulusPieChart',
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
    centerLabel: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 0
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
      let has = false
      let _data = []
      if (Array.isArray(data)) {
        _data = data.map(x => {
          if (x.value > 0) {
            has = true
          }
          return {
            name: x.name,
            value: x.value,
            itemStyle: {
              color: x.color
            }
          }
        })
      }
      if (has) {
        _data = _data.filter(y => {
          return y.value > 0
        })
      }
      return {
        color: this.color,
        tooltip: {
          show: true
        },
        // title: [
        //   {
        //     text: this.centerLabel,
        //     x: 'center',
        //     top: '52%',
        //     textStyle: {
        //       color: '#4A5568',
        //       fontSize: this.fontSize(0.14),
        //       fontWeight: '500'
        //     }
        //   },
        //   {
        //     text: sum !== undefined ? sum : '',
        //     x: 'center',
        //     top: '42%',
        //     textStyle: {
        //       fontSize: this.fontSize(0.44),
        //       color: '#1B2838',
        //       fontWeight: '500'
        //     }
        //   }
        // ],
        series: [
          {
            type: 'pie',
            center: ['50%', '53%'],
            radius: ['0%', '25%'],
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
                  fontSize: this.fontSize(0.40),
                  color: '#1B2838',
                  lineHeight: this.fontSize(0.3) * 1.5
                },
                title: {
                  color: '#1B2838',
                  fontSize: this.fontSize(0.14)
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
                // itemStyle: {
                //   color: 'rgba(0,0,0,0)'
                // }
              }
            ]
          },
          {
            type: 'pie',
            center: ['50%', '55%'],
            radius: ['33%', '48%'],
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
                type: 'solid'
              },
              length: 8,
              length2: 8
            },
            data: _data
          }
        ],
        legend: {
          show: this.legend,
          right: 16,
          top: 2,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 15,
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
          }
        }
      }
    },
    noData () {
      return Array.isArray(this.chartData) && this.chartData.length === 0
    }
  }
}
</script>
