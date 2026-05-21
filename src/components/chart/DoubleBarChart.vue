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
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([BarChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'DoubleBarChart',
  mixins: [chartMixins],
  components: {
    Chart
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      color: [
        'rgb(255,77,74)',
        'rgb(255,153,0)',
        'rgb(30,136,229)',
        'rgb(86,205,195)',
        'rgb(72,205,127)',
        'rgb(88,86,205)',
        'rgb(236,74,158)',
        'rgb(207,74,180)',
        'rgb(180,74,207)',
        'rgb(143,74,207)',
        'rgb(74,184,207)',
        'rgb(74,207,93)',
        'rgb(124,207,74)',
        'rgb(162,207,74)',
        'rgb(207,199,74)',
        'rgb(207,199,74)',
        'rgb(255,146,74)',
        'rgb(255,205,74)',
        'rgb(255,255,74)',
        'rgb(205,255,74)',
        'rgb(155,255,74)',
        'rgb(105,255,74)',
        'rgb(55,255,74)',
        'rgb(55,255,124)',
        'rgb(55,255,174)',
        'rgb(55,255,224)',
        'rgb(55,255,124)',
        'rgb(55,224,255)',
        'rgb(55,174,255)',
        'rgb(55,80,255)',
        'rgb(55,80,255)',
        'rgb(154,55,255)',
        'rgb(154,55,255)',
        'rgb(200,55,255)',
        'rgb(255,55,255)',
        'rgb(255,55,180)',
        'rgb(255,55,150)',
        'rgb(255,55,100)',
        'rgb(86,117,205)',
        'rgb(86,170,205)',
        'rgb(86,170,205)',
        'rgb(86,205,195)',
        'rgb(134,205,86)',
        'rgb(173,205,86)',
        'rgb(173,205,86)',
        'rgb(173,205,86)',
        'rgb(205,192,86)',
        'rgb(213,140,62)',
        'rgb(232,118,118)',
        'rgb(232,118,196)',
        'rgb(212,118,232)',
        'rgb(212,118,232)',
        'rgb(174,118,232)',
        'rgb(118,188,232)',
        'rgb(118,188,232)',
        'rgb(118,223,232)',
        'rgb(118,232,204)',
        'rgb(118,232,204)',
        'rgb(162,232,105)',
        'rgb(195,232,105)',
        'rgb(216,232,105)',
        'rgb(216,232,105)',
        'rgb(233,189,105)',
        'rgb(233,150,105)',
        'rgb(233,150,105)',
        'rgb(233,105,105)',
        'rgb(255,142,142)',
        'rgb(255,142,240)',
        'rgb(255,142,240)',
        'rgb(214,142,255)',
        'rgb(214,142,255)',
        'rgb(150,142,255)',
        'rgb(142,193,255)',
        'rgb(150,142,255)',
        'rgb(142,255,255)',
        'rgb(142,255,166)',
        'rgb(200,255,142)',
        'rgb(200,255,142)',
        'rgb(255,255,142)',
        'rgb(255,205,142)',
        'rgb(200,142,142)']
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
      default: () => []
      // 传入格式为[{xAxisName,yValue1,yValue2}]
    },
    loading: {
      type: Boolean,
      default: false
    },
    yAxisSetting: {
      type: Array,
      // 传入格式为[{min,max,name,company}{min,max,name,company}]
      default: () => {
        return [{
          min: '0',
          max: '100',
          name: '效率',
          company: '%'
        }, {
          min: '0',
          max: '200',
          name: '时长',
          company: 'h'
        }]
      }
    }
  },

  computed: {
    option () {
      const arr = this.chartData
      const xAxisName = []
      const yValue1 = []
      const yValue2 = []
      arr.map(o => {
        xAxisName.push(o.xAxisName || 'x轴')
        yValue1.push(o.yValue1 || 10)
        yValue2.push(o.yValue1 || 20)
      })

      const xAxisData = xAxisName
      const yAxisSetting = this.yAxisSetting
      const yAxisnames = [yAxisSetting[0].name, yAxisSetting[1].name]
      var colors = ['#8B5CF6', '#6366F1']
      return {
        colors: ['#8B5CF6', '#6366F1'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },

        grid: {
          top: '20%',
          left: '5%',
          right: '10%',
          bottom: '9%',
          containLabel: true
        },

        legend: {
          data: yAxisnames,
          fontSize: this.fontSize(0.13),
          top: '5%'
        },

        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: yAxisSetting[0].name || '',
            min: yAxisSetting[0].min || 0,
            max: yAxisSetting[0].max || 200,
            position: 'left',
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} ' + yAxisSetting[0].company || ''
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#edeeee']
              }
            }
          },
          {
            type: 'value',
            name: yAxisSetting[1].name || '',
            min: yAxisSetting[1].min || 0,
            max: yAxisSetting[1].max || 200,
            position: 'right',
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} ' + yAxisSetting[1].company || ''
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#edeeee']
              }
            }
          }
        ],
        series: [
          {
            name: yAxisnames[0],
            type: 'bar',
            data: yValue1,
            color: '#8B5CF6'
          },
          {
            name: yAxisnames[1],
            type: 'bar',
            yAxisIndex: 1,
            data: yValue2,
            color: '#6366F1'
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
