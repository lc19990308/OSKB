<template>
  <chart
    :loading="loading"
    :options="option"
    autoresize
    :fixedHeight="420"
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
  name: 'RelationChart',
  mixins: [chartMixins],
  components: {
    Chart
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      color: [
        '#991B1B',
        '#EF4444',
        '#F59E0B',
        '#8B5CF6',
        '#10B981'
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
    chartLink: {
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
      return {
        color: this.color,
        tooltip: {
          show: true,
          formatter (params) {
            if (params.dataType === 'node') {
              return `<div style="min-width: 150px">${params.marker ? params.marker : ''}${params.data.name}</div>`
            } else {
              return `${params.data.value}`
            }
          }
        },
        series: [
          {
            type: 'graph',
            edgeLabel: {
              normal: {
                formatter: '{c}',
                show: false
              }
            },
            edgeSymbol: [null, 'arrow'],
            // edgeSymbolSize: 12,
            force: {
              repulsion: 2000
            },
            layout: 'circular', // force circular
            roam: true,
            label: {
              normal: {
                show: true,
                position: 'top',
                overflow: 'truncate',
                ellipsis: '...',
                width: 210,
                fontSize: 12,
                distance: 8
              }
            },
            lineStyle: {
              join: 'miter',
              miterLimit: 20
              // curveness: -0.05
            },
            symbol: 'circle',
            symbolSize: 46,
            links: this.chartLink,
            data: this.chartData
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
