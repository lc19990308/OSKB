<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'

export default {
  name: 'NestedPieChart',
  data () {
    return {
      width: '100%',
      height: '460px'
    }
  },
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    chartData: {
      type: Object,
      required: true
    },
    centerLabel: {
      type: String,
      default: '漏洞总数'
    }
  },
  methods: {
    setOptions ({ sum, data } = { sum: 0, data: [] }) {
      if (!this.chart) {
        return 0
      }
      let has = false
      let _data = data.map(x => {
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
      if (has) {
        _data = _data.filter(y => {
          return y.value > 0
        })
      }
      this.chart.setOption({
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
              fontSize: 14,
              color: '#ffffff',
              lineHeight: '20',
              formatter: (x) => {
                return this.centerLabel + '：' + x.value + '个'
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
            radius: ['45%', '53%'],
            startAngle: [224],
            label: {
              position: 'outside',
              fontSize: 14,
              color: '#333333',
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
                color: '#333333'
              },
              length: 8,
              length2: 8
            },
            data: _data
          }
        ]
      })
      this.chart.hideLoading()
    },
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.showLoading({
        text: 'loading',
        color: '#1a78cf',
        textColor: '#ffffff',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
      })
      this.setOptions(this.chartData)
    },
    sidebarResizeHandler (e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.setOptions(val)
      }
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  mounted () {
    this.height = parseInt(this.$el.clientWidth * 0.58) + 'px'
    setTimeout(() => {
      this.initChart()
    }, 100)
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        new Promise((resolve) => {
          this.height = parseInt(this.$el.clientWidth * 0.58) + 'px'
          resolve()
        }).then(() => {
          this.chart.resize()
        })
      }
    }, 400)
    window.addEventListener('resize', this.__resizeHandler)
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  }
}
</script>
