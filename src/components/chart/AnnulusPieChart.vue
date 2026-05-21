<template>
  <chart
    :loading="loading"
    :fixed-height="height"
    :options="option"
    autoresize
    :percentage="percentage"
    :no-data="noData"
  ></chart>
</template>

<script>
import * as echarts from 'echarts'
import { PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([PieChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'AnnulusPieChart',
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
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    legend: {
      type: Boolean,
      default: false
    },
    legendConf: {
      type: Object,
      default () {
        return {}
      }
    },
    centerLabel: {
      type: [String, Boolean],
      default: ''
    },
    height: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    option () {
      const { data, sum } = this.chartData
      let has = false
      let allHide = true
      let _data = []
      if (Array.isArray(data)) {
        _data = data.map(x => {
          has = x.value > 0
          if (has) {
            allHide = false
          }
          return {
            label: {
              show: has
            },
            name: x.name,
            value: x.value,
            itemStyle: {
              color: x.color
            }
          }
        })
        if (allHide) {
          _data = _data.map(x => {
            return {
              ...x,
              label: {
                show: true
              }
            }
          })
        }
      }
      const legendData = data.map(item => {
        return {
          name: item.name
        }
      })
      return {
        color: [
          '#EF4444',
          '#FF9900',
          '#3699FF',
          '#48CDC5',
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
        ],
        tooltip: {
          show: true
        },
        series: [
          ...(this.centerLabel === false ? [] : [
            {
              id: 'center',
              type: 'pie',
              center: ['50%', '53%'],
              radius: ['0%', '25%'],
              startAngle: [90],
              label: {
                show: true,
                position: 'center',
                color: '#333333',
                formatter: (x) => {
                  return `{data|${x.value}}\n{title|${x.name}}`
                },
                rich: {
                  data: {
                    fontSize: this.fontSize(0.30),
                    color: '#333333',
                    lineHeight: this.fontSize(0.4) * 1.5
                  },
                  title: {
                    color: '#333333',
                    fontSize: this.fontSize(0.14),
                    lineHeight: this.fontSize(-0.2) * 1.5
                  }
                }
              },
              itemStyle: {
                color: 'rgba(0,0,0,0)'
              },
              data: [
                {
                  value: sum,
                  name: this.centerLabel
                  // itemStyle: {
                  //   color: 'rgba(0,0,0,0)'
                  // }
                }
              ]
            }
          ]),
          {
            id: 'main',
            type: 'pie',
            center: ['50%', '55%'],
            radius: ['40%', '52%'],
            startAngle: [224],
            label: {
              position: 'outside',
              fontSize: this.fontSize(0.14),
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
                type: 'solid'
              },
              length: 8,
              length2: 8
            },
            data: _data
          }
        ],
        legend: {
          show: this.legend,
          id: 'main',
          name: 'main',
          right: '5%',
          top: '5%',
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: this.fontSize(0.10),
          textStyle: {
            fontSize: this.fontSize(0.12),
            color: '#333333'
          },
          data: legendData,
          ...this.legendConf
        },
        media: [
          {
            query: {
              maxHeight: 230
            },
            option: {
              color: this.color,
              tooltip: {
                show: true
              },
              series: [
                ...(this.centerLabel === false ? [] : [
                  {
                    id: 'center',
                    type: 'pie',
                    center: ['50%', '53%'],
                    radius: ['0%', '25%'],
                    startAngle: [90],
                    label: {
                      show: true,
                      position: 'center',
                      color: '#333333',
                      formatter: (x) => {
                        return `{data|${x.value}}\n{title|${x.name}}`
                      },
                      rich: {
                        data: {
                          fontSize: this.fontSize(0.24),
                          color: '#333333',
                          lineHeight: this.fontSize(0.3) * 1.5
                        },
                        title: {
                          color: '#333333',
                          fontSize: this.fontSize(0.12),
                          lineHeight: this.fontSize(-0.2) * 1.5
                        }
                      }
                    },
                    itemStyle: {
                      color: 'rgba(0,0,0,0)'
                    },
                    data: [
                      {
                        value: sum,
                        name: this.centerLabel
                        // itemStyle: {
                        //   color: 'rgba(0,0,0,0)'
                        // }
                      }
                    ]
                  }
                ]),
                {
                  id: 'main',
                  type: 'pie',
                  center: ['50%', '55%'],
                  radius: ['40%', '54%'],
                  startAngle: [224],
                  label: {
                    position: 'outside',
                    fontSize: this.fontSize(0.14),
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
                      type: 'solid'
                    },
                    length: 8,
                    length2: 8
                  },
                  data: _data
                }
              ],
              legend: {
                show: this.legend,
                id: 'main',
                name: 'main',
                right: '20px',
                top: '20px',
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: this.fontSize(0.10),
                textStyle: {
                  fontSize: this.fontSize(0.12),
                  color: '#333333'
                },
                data: legendData,
                ...this.legendConf
              }
            }
          },
          {
            query: {
              minHeight: 400
            },
            option: {
              color: this.color,
              tooltip: {
                show: true
              },
              series: [
                ...(this.centerLabel === false ? [] : [
                  {
                    id: 'center',
                    type: 'pie',
                    center: ['50%', '53%'],
                    radius: ['0%', '25%'],
                    startAngle: [90],
                    label: {
                      show: true,
                      position: 'center',
                      color: '#333333',
                      formatter: (x) => {
                        return `{data|${x.value}}\n{title|${x.name}}`
                      },
                      rich: {
                        data: {
                          fontSize: this.fontSize(0.40),
                          color: '#333333',
                          lineHeight: this.fontSize(0.45) * 1.5
                        },
                        title: {
                          color: '#333333',
                          fontSize: this.fontSize(0.14),
                          lineHeight: this.fontSize(-0.2) * 1.5
                        }
                      }
                    },
                    itemStyle: {
                      color: 'rgba(0,0,0,0)'
                    },
                    data: [
                      {
                        value: sum,
                        name: this.centerLabel
                        // itemStyle: {
                        //   color: 'rgba(0,0,0,0)'
                        // }
                      }
                    ]
                  }
                ]),
                {
                  id: 'main',
                  type: 'pie',
                  center: ['50%', '55%'],
                  radius: ['40%', '52%'],
                  startAngle: [224],
                  label: {
                    position: 'outside',
                    fontSize: this.fontSize(0.14),
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
                      type: 'solid'
                    },
                    length: 8,
                    length2: 8
                  },
                  data: _data
                }
              ],
              legend: {
                show: this.legend,
                id: 'main',
                name: 'main',
                right: '5%',
                top: '5%',
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: this.fontSize(0.10),
                textStyle: {
                  fontSize: this.fontSize(0.12),
                  color: '#333333'
                },
                data: legendData,
                ...this.legendConf
              }
            }
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
