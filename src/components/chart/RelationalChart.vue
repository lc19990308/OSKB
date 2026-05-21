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
import { GraphChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([GraphChart, TooltipComponent, CanvasRenderer])

export default {
  name: 'RelationalChart',
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
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
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
              id: item.id,
              name: item.name,
              symbolSize: 12,
              category: item.category,
              value: item.value,
              itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 2,
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowBlur: 10
              }
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
      return Array.isArray(this.chartData) && this.chartData.length === 0
    }
  }
}
</script>
