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
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent, LinearGradient } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Chart from '@/components/public/Chart'
import chartMixins from '@/mixins/chartMixins'

echarts.use([TreeChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

export default {
  name: 'AssetTreeChart',
  mixins: [chartMixins],
  data () {
    return {
      windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
  },
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
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    option (t) {
      const d = this.chartData
      const color = [
        '#ffbc34',
        '#10B981',
        new LinearGradient(1, 0, 0, 0, [{
          offset: 0,
          color: '#19b4e7'
        }, {
          offset: 1,
          color: '#1a45b6'
        }]),
        new LinearGradient(1, 0, 0, 0, [{
          offset: 0,
          color: '#8B5CF6'
        }, {
          offset: 1,
          color: '#8B5CF6'
        }])
      ]
      const color2 = [
        '#ffbc34',
        '#10B981',
        '#19b4e7',
        '#8B5CF6'
      ]
      const infoObj = {
        target_ip: d.ip,
        subs: d.subs || {},
        weblinks: d.weblinks || {}
      }
      const that = this
      function createChildren (config) {
        return {
          name: config.name || '',
          symbol: 'circle',
          tooltip: {
            formatter: function (i) {
              return config.tooltip_text ? config.tooltip_text : i.name
            }
          },
          value: config.execute || 0,
          symbolSize: that.fontSize(0.1),
          show: true,
          color: config.status === '0' ? '#5e5b5b' : color[config.item_color_index || 0],
          borderColor: color[config.item_color_index || 0],
          borderWidth: 4,
          shadowColor: color2[config.item_color_index || 0],
          shadowBlur: config.status === '1' ? 20 : 0,
          lineStyle: {
            color: color[config.line_color_index || 0]
          },
          label: {
            fontSize: that.fontSize(0.1),
            color: '#333333', // 字体颜色
            position: config.label_position || 'top',
            formatter: function (i) {
              if (i.name && i.name.length > 50) {
                const s = i.name.substring(0, 50)
                return s + '...'
              }
              return i.name
            }
          },
          children: config.children || []
        }
      }

      const subsList = []
      // infoObj.subs.forEach(function (item, index) {
      //     constsubs_list_children = [];
      //     if (Array.isArray(item.ip) && item.ip.length > 0) {
      //         subs_list_children = item.ip.map(function (itm, idx) {
      //             return createChildren({
      //                 name: $rootScope.Base64.decode(itm),
      //                 line_color_index: 0,
      //                 item_color_index: 0,
      //                 label_position: "right",
      //                 children: []
      //             });
      //         })
      //     }

      //     subs_list.push(createChildren({
      //         name: index,
      //         line_color_index: 0,
      //         item_color_index: 0,
      //         label_position: "top",
      //         status: item.status,
      //         execute: item.status == '1' ? 2 : 0,
      //         children: subs_list_children,
      //         tooltip_text: "含" + subs_list_children.length + "个IP地址"
      //     }))
      // });

      const weblinksList = []
      infoObj.weblinks.forEach(function (item, index) {
        const weblinksListChildren = [createChildren({
          name: item.num + '个链接',
          line_color_index: 1,
          item_color_index: 1,
          label_position: 'right',
          children: [],
          execute: 1,
          tooltip_text: item.num + '个外部链接'
        })]
        weblinksList.push(createChildren({
          name: index,
          line_color_index: 1,
          item_color_index: 1,
          label_position: 'top',
          status: item.status,
          execute: item.status === '1' ? 2 : 0,
          children: weblinksListChildren,
          tooltip_text: '含' + weblinksListChildren.length + '个外部链接'
        }))
      })

      const treeNum = t.treeNum
      const tree2Num = t.treesNum
      const data = {
        name: '目标网站\n' + infoObj.target_ip.substr(),
        symbolSize: this.fontSize(0.15),
        label: {
          fontSize: this.fontSize(0.14),
          color: '#333333',
          formatter: function (i) {
            if (i.name && i.name.length > 60) {
              const s = i.name.substring(0, 60)
              return s + '...'
            }
            return i.name
          }
        },
        show: true,
        color: color2[3],
        borderColor: color2[3],
        borderWidth: 2,
        shadowColor: color2[3],
        shadowBlur: 0,
        children: [
          createChildren({
            name: '二级域名',
            line_color_index: 3,
            item_color_index: 0,
            label_position: 'top',
            children: subsList,
            tooltip_text: '含' + treeNum + '个二级域名'
          }),
          createChildren({
            name: '外部链接',
            line_color_index: 3,
            item_color_index: 1,
            label_position: 'top',
            children: weblinksList,
            tooltip_text: '含' + tree2Num + '个外部链接域名'
          })
        ]
      }

      // const substr = function (str) {
      //   if (str && str.length > 30) {
      //     const s = str.substring(0, 30)
      //     // const z = str.substring(30);
      //     return s + '...'
      //   }
      //   return str
      // }

      //   if (Array.isArray(data)) {

      //   }
      //   if (has) {
      //     _data = _data.filter(y => {
      //       return y.value > 0
      //     })
      //   }
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            initialTreeDepth: -1,
            data: [data],
            top: '5%',
            left: '20%',
            bottom: '5%',
            right: '30%',
            symbol: 'circle',
            symbolSize: this.fontSize(0.1),
            label: {
              position: 'left',
              verticalAlign: 'middle',
              color: '#333333',
              fontSize: this.fontSize(0.14)
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
