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
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'DoubleBarFilpChart',
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
        'rgb(200,142,142)'
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
      default: () => ([])
      // 传入格式为[{xAxisName:'',valueData1:'',valueData2:''}]
    },
    loading: {
      type: Boolean,
      default: false
    },
    valueSetting: {
      type: Array,
      // 传入格式为[{min:'',max:'',name:'',company:''}....]
      default: () => {
        return [
          {
            min: 0,
            max: 30,
            name: '次数',
            company: '',
            position: 'top',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#EE6666'
              }
            }
          },
          {
            min: 0,
            max: 100,
            position: 'bottom',
            name: '频率',
            company: '%',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#5470C6'
              }
            }
          }
        ]
      }
    },
    //
    max: {
      // 数据的最大值与总图标的最大值的比例
      default: () => 0.92
    }
  },
  computed: {
    option () {
      const arr = this.chartData
      // chartData:{labelNames:[...],valueData1:[...],valueData2:[...],valueNames:[..]}
      const labelNames = arr.labelNames || ['', '', '', '', '', '']
      const valueData1 = arr.valueData1 || [0, 0, 0, 0, 0, 0]
      const valueData2 = arr.valueData2 || [0, 0, 0, 0, 0, 0]
      const valueNames = arr.valueNames || ['', '']
      const valueSetting = this.valueSetting
      const grid = arr.grid
      return {
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis',
          // formatter: '{a0}{a}{b}{c}',
          formatter: '漏洞名称：{b}<br />{a0}:{c0}次<br/>{a1}:{c1}%',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: valueNames
        },
        grid: grid || {
          left: '4%',
          right: '8%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: valueSetting || {
          type: 'value',
          boundaryGap: [0, (1 - this.max > 0.6 && 1 - this.max < 0.98) ? 1 - this.max : 0.5]
        },
        yAxis: {
          type: 'category',
          data: labelNames
        },
        series: [
          {
            name: valueNames[0],
            type: 'bar',
            data: valueData1
          },
          {
            name: valueNames[1],
            type: 'bar',
            data: valueData2
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
<style lang="scss" scoped>
.chart-wrap {
  .echarts {
    width: 100%;
    height: 100%;
  }

  position: relative;

  .no-data {
    width: 100%;
    text-align: center;
    color: #b4bccc;
    position: absolute;
    top: 50%;
  }
}
</style>
