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
import { LinearGradient } from 'echarts/lib/util/graphic'
import chartMixins from '@/mixins/chartMixins'

echarts.use([TreeChart, TooltipComponent, CanvasRenderer])

export default {
  name: 'TreeChart',
  mixins: [chartMixins],
  components: {
    Chart
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
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
    }
  },
  computed: {
    option () {
      const data = this.chartData
      const color = [
        '#ffbc34',
        '#4A9C8C',
        new LinearGradient(1, 0, 0, 0, [{ offset: 0, color: '#19b4e7' }, { offset: 1, color: '#1a45b6' }]),
        new LinearGradient(1, 0, 0, 0, [{ offset: 0, color: '#2C5F8A' }, { offset: 1, color: '#2C5F8A' }])
      ]
      // const color2 = [
      //   '#ffbc34',
      //   '#4A9C8C',
      //   '#19b4e7',
      //   '#2C5F8A'
      // ]
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            initialTreeDepth: -1,
            data: data,
            top: '5%',
            left: '20%',
            bottom: '5%',
            right: '30%',
            symbol: 'circle',
            symbolSize: this.fontSize(0.1),
            color: color[2],
            borderColor: color[2],
            label: {
              position: 'bottom',
              verticalAlign: 'middle',
              align: 'center'
            },
            // 线的样式
            lineStyle: {
              color: color[3],
              curveness: '0.5'
            },
            leaves: {
              label: {
                // 叶子节点字的样式
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
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
