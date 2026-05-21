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
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([BarChart, TooltipComponent, CanvasRenderer])

export default {
  name: 'GraphChart',
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
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    option () {
      const { data, categories, links } = { categories: [], links: [], data: [], ...this.chartData }
      return {
        tooltip: {
          show: true,
          formatter: (item) => {
            return item.name
          }
        },
        animationEasingUpdate: 'quinticInOut',
        series: [{
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: 100,
            edgeLength: [10, 5]
          },
          data: data.map((item) => {
            return {
              name: item.name,
              category: item.category,
              id: item.id,
              value: item.value,
              borderColor: '#ffffff',
              borderWidth: 2,
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowBlur: 10
            }
          }),
          links: links.map((item) => {
            return {
              source: item.source,
              target: item.target,
              lineStyle: {
                color: '#d3d3d4',
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowBlur: 2
              }
            }
          }),
          categories: categories,
          focusNodeAdjacency: true,
          roam: true,
          label: {
            show: true,
            position: 'top'
          },
          lineStyle: {
            color: 'source',
            curveness: 0,
            type: 'solid'
          }
        }]
      }
    },
    noData () {
      const { data } = { data: [], ...this.chartData }
      return data.length === 0
    }
  }
}
</script>
