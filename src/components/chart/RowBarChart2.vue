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
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

export default {
  name: 'RowBarChart2',
  mixins: [chartMixins],
  components: {
    Chart
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      color: [
        '#8B1A1A',
        '#D9534F',
        '#D4932A',
        '#2C5F8A',
        '#5B8BA0'
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
    loading: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    option () {
      const rich = {
        labelStyle: {
          color: '#1B2838',
          fontWeight: 500,
          fontSize: 12
        }
      }
      this.color.forEach((x, y) => {
        rich['color' + y] = {
          color: x,
          fontWeight: 700,
          fontSize: 14
        }
      })

      return {
        color: [
          '#8B1A1A',
          '#D9534F',
          '#D4932A',
          '#2C5F8A',
          '#5B8BA0'
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (x) {
            return '<div>' + x[0].name.replace(/[\r\n]/g, '<br>') + '<br>' +
                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + x[0].color + '"></span>' +
                '' + x[0].value + '<br>' + '</div>'
          }
        },
        grid: {
          top: '20%'
          // bottom: '5%',
          // containLabel: true
        },
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     yAxisIndex: 0,
        //     zoomLock: true,
        //     width: 10,
        //     showDetail: false,
        //     start: 0,
        //     end: 100,
        //     handleSize: '110%',
        //     handleStyle: {
        //       color: '#d3dee5'
        //     },
        //     borderColor: '#90979c'
        //   },
        //   {
        //     type: 'inside',
        //     id: 'insideY',
        //     yAxisIndex: 0,
        //     start: 0,
        //     end: 100,
        //     zoomOnMouseWheel: false,
        //     moveOnMouseMove: true,
        //     moveOnMouseWheel: true
        //   }
        // ],
        yAxis: [
          {
            inverse: true,
            type: 'category',
            data: this.chartData.map(function (i) {
              return i.name
            }),
            axisLine: {
              show: false,
              lineStyle: {
                color: '#f0f1f1'
              }
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            },
            axisLabel: {
              show: false,
              margin: 140,
              fontSize: 14,
              align: 'left',
              color: '#1B2838',
              rich: rich,
              formatter: function (name, index) {
                let num = ''
                let str = ''
                num = (index + 1)
                if (index === 0) {
                  str = `{color${index}|${num}} {color${index}|${name}}`
                } else if (index === 1) {
                  str = `{color${index}|${num}} {color${index}|${name}}`
                } else {
                  str = `{color${index}|${num}} {color${index}|${name}}`
                }
                return str
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            type: 'value',
            minInterval: 1,
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#f0f1f1'
              }
            },
            axisLabel: {
              show: false,
              color: '#1B2838',
              fontSize: this.fontSize(0.13)
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#f0f1f1'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: '22',
            itemStyle: {
              barBorderRadius: 5
            },
            label: {
              show: true,
              position: [0, '-24px'],
              color: '#1B2838',
              fontSize: 14,
              align: 'left',
              rich: rich,
              formatter: function ({ name, dataIndex }) {
                let num = ''
                let str = ''
                num = (dataIndex + 1)
                if (dataIndex === 0) {
                  str = `{color${dataIndex}|${num}} {labelStyle|${name}}`
                } else if (dataIndex === 1) {
                  str = `{color${dataIndex}|${num}} {labelStyle|${name}}`
                } else {
                  str = `{color${dataIndex}|${num}} {labelStyle|${name}}`
                }
                return str
              }
            },
            data: this.chartData.map((i, x, a) => {
              return {
                name: i.name,
                value: i.value || 0,
                itemStyle: {
                  ...(color => color ? { color: color } : { color: this.color[x % this.color.length] })(i.color),
                  emphasis: {
                    shadowBlur: 15,
                    shadowColor: 'rgba(0, 0, 0, 0.1)'
                  }
                }
              }
            })
          }
        ],
        label: {
          show: true,
          fontSize: this.fontSize(0.12),
          position: 'top',
          formatter: '{c}',
          color: '#1B2838'
        }
      }
    },
    noData () {
      return Array.isArray(this.chartData) && this.chartData.length === 0
    }
  }
}
</script>
