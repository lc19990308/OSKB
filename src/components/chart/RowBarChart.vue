<template>
  <el-row>
    <el-col :span="24 / row" v-for="(item, idx) in option" :key="'row-bar-chart-' + idx">
      <chart
        :loading="loading"
        :options="item"
        autoresize
        :fixed-height="height"
        :percentage="percentage"
        :no-data="noData"
      ></chart>
    </el-col>
  </el-row>
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
  name: 'RowBarChart',
  mixins: [chartMixins],
  components: {
    Chart
  },
  data () {
    return {
      color: [
        '#8B1A1A',
        '#D9534F',
        '#D4932A',
        '#2C5F8A',
        '#5B8BA0'
      ],
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
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    chartData: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    },
    row: {
      type: Number,
      default: 1
    },
    height: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  computed: {
    option () {
      const rich = {}
      this.color.forEach((x, y) => {
        rich['nt' + y] = {
          color: '#fff',
          backgroundColor: x,
          width: 16,
          height: 16,
          borderRadius: 3,
          align: 'center'
        }
        rich['title' + y] = {
          color: '#4A5568',
          // width: 90,
          align: 'left'
        }
      })
      let maxValue = 0
      this.chartData.forEach(x => {
        if (x.value > maxValue) {
          maxValue = x.value
        }
      })
      const count = 10 / this.row
      return Array.from({ length: this.row }).map((_, idx) => {
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
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (x) {
              return '<div>' + x[0].name.replace(/[\r\n]/g, '<br>') + '<br>' +
                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + x[0].color + '"></span>' +
                '' + x[0].value + '<br>' + '</div>'
            }
          },
          grid: {
            left: '159',
            right: '60',
            top: '10%',
            bottom: '5%'
          },
          yAxis: [
            {
              inverse: true,
              type: 'category',
              data: this.chartData.slice(idx, count).map(function (i) {
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
                margin: -130,
                fontSize: this.fontSize(0.13),
                align: 'left',
                color: '#1B2838',
                rich: rich,
                inside: true,
                formatter: (val, index) => {
                  let value = val
                  const a = 3
                  if (val.length > 8) {
                    if (/[\u4E00-\u9FA5]{5,8}/.test(val)) {
                      value = val.slice(0, 7) + '...'
                    } else {
                      value = val.slice(0, 13) + '...'
                    }
                  }
                  if (a > index && idx === 0) {
                    return [
                      '{nt' + index + '|' + (index + 1) + '}' + '  {title' + index + '|' + value + '}'
                    ].join('\n')
                  } else {
                    return [
                      '{nt' + 3 + '|' + (idx * count + index + 1) + '}' + '  {title' + 3 + '|' + value + '}'
                    ].join('\n')
                  }
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
              max: maxValue,
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
              z: 3,
              type: 'bar',
              barWidth: this.row > 1 ? 7 : 12,
              itemStyle: {
                borderRadius: 3
              },
              data: this.chartData.slice(idx, count).map((i, x) => {
                let color = this.color[0]
                const a = 3
                if (idx === 0 && (a > x)) {
                  color = this.color[x % this.color.length]
                } else {
                  color = this.color[3]
                }
                return {
                  name: i.name,
                  value: i.value || 0,
                  itemStyle: {
                    color: color
                  }
                }
              })
            },
            {
              type: 'bar',
              barWidth: this.row > 1 ? 7 : 12,
              barGap: '-100%',
              itemStyle: {
                borderRadius: 3
              },
              label: {
                show: true,
                position: 'right',
                color: '#1B2838',
                formatter: (value) => {
                  return value.data.val
                },
                offset: [12, 0]
              },
              data: this.chartData.slice(idx, count).map((i) => {
                return {
                  name: i.name,
                  value: maxValue,
                  val: i.value,
                  itemStyle: {
                    color: '#edeff2'
                  }
                }
              })
            }
          ],
          ...this.options
        }
      })
    },
    noData () {
      return !(Array.isArray(this.chartData) && this.chartData.length > 0)
    }
  }
}
</script>
<style lang="scss" scoped>
.no-data {
  width: 100%;
  text-align: center;
  color: #b4bccc;
  position: absolute;
  top: 50%;
  transform: translateY(-55px);

  //img{
  //  width: 100px;
  //  margin-bottom: 3px;
  //}
}
</style>
