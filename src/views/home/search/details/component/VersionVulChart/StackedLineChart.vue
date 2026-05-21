<template>
  <chart :loading="loading" :fixed-height="300" :options="option" autoresize :percentage="percentage" :no-data="noData"></chart>
</template>

<script>
import * as echarts from 'echarts'
import {
  BarChart,
  LineChart
} from 'echarts/charts'
import {
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components'
import {
  CanvasRenderer
} from 'echarts/renderers'
import Chart from '@/components/public/Chart/index.vue'
import {
  debounce
} from '@/utils'
import {
  addListener,
  removeListener
} from 'resize-detector'

echarts.use([BarChart, LineChart, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'StackedLineChart',
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
    options: {
      type: Object,
      default () {
        return {}
      }
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
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      color: [
        '#8600D3',
        '#991B1B',
        '#EF4444',
        '#F59E0B',
        '#8B5CF6'
      ]
    }
  },
  computed: {
    option () {
      const {
        data,
        label,
        color
      } = {
        data: [],
        label: [],
        color: this.color,
        ...this.chartData
      }
      const series = []
      label.forEach((item, index) => {
        series.push({
          name: item,
          type: 'line',
          symbol: 'circle',
          symbolSize: 8,
          // smooth: true,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            position: 'top',
            color: '#333333'
          },
          data: data.map((x) => {
            return {
              value: x.value[index],
              id: x.id
            }
          })
        })
      })
      return {
        color: color,
        legend: {
          right: 13,
          top: '5%',
          symbol: '',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: this.fontSize(0.10),
          icon: 'circle',
          fontSize: this.fontSize(0.14),
          itemStyle: {
            borderWidth: 0
          },
          formatter: function (name) {
            return ['{name|' + name + '}']
          },
          textStyle: {
            rich: {
              name: {
                verticalAlign: 'center',
                padding: [3, 0, 0, 0]
              }
            }
          },
          data: label.map((item) => {
            return {
              name: item,
              color: '#666666'
            }
          })
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#bbbbbb'
            }
          }
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '5%',
          bottom: 70,
          containLabel: true
        },
        dataZoom: [{
          type: 'slider',
          show: true,
          realtime: true,
          start: 65,
          end: 85,
          bottom: 20
        },
        {
          type: 'inside',
          realtime: true,
          start: 65,
          end: 85
        }
        ],
        xAxis: [{
          nameLocation: 'end',
          nameTextStyle: {
            color: '#333',
            align: 'left',
            padding: [20, 0, 0, -10]
          },
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#edeeee'
            }
          },
          axisLabel: {
            color: '#333333',
            margin: 15,
            fontSize: this.fontSize(0.12)
          },
          axisTick: {
            show: false
          },
          data: data.map(function (item) {
            return item.name
          })
        }],
        yAxis: [{
          type: 'value',
          position: 'left',
          // axisLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#edeeee'
          //   }
          // },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#edeeee',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#333333',
            formatter: '{value}',
            fontSize: this.fontSize(0.12)
          }
        }],
        series: series,
        ...this.options
      }
    },
    noData () {
      const {
        data
      } = {
        data: [],
        ...this.chartData
      }
      return data.length === 0
    }
  },
  methods: {
    init () {
      this.__resizeHandler = debounce(
        () => {
          this.windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        },
        100
      )
      addListener(this.$el, this.__resizeHandler)
    },
    fontSize (size) {
      if (!this.windowWidth) return
      const fontSize = 100 * (this.windowWidth / 1920)
      return size * fontSize
    }
  },
  mounted () {
    this.init()
  },
  destroy () {
    if (this.$el && this.__resizeHandler) {
      removeListener(this.$el, this.__resizeHandler)
    }
  }
}

</script>
