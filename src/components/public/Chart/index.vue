<template>
  <div v-loading="firstLoading" element-loading-spinner="el-icon-refresh" class="chart-wrap" :style="{ 'height': percentage === 'auto' ? '100%' : height + 'px' }">
    <div class="echarts" ref="chart" :style="{visibility: noData ? 'hidden' : 'visible'}" />
    <div class="no-data" v-if="noData">
      <svg class="icon svg-icon" aria-hidden="true" :style="{width:'80px',height: '80px'}">
        <use xlink:href="#iconkongshujuicon"></use>
      </svg>
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { debounce } from '@/utils'
import { addListener, removeListener } from 'resize-detector'

const INIT_TRIGGERS = ['theme', 'initOptions', 'autoresize']
const REWATCH_TRIGGERS = ['manualUpdate', 'watchShallow']

/**
 * options：echarts的options
 * props参数介绍：
 * percentage：统计图的宽高比 默认'1:0.58' 宽：1， 高：0.58
 * noData：暂无数据
 * loading：echarts原生的loading
 * autoresize：是否开启echarts的resize
 * 其他参数不传
 **/

export default {
  props: {
    options: Object,
    percentage: {
      type: String,
      default () {
        return '1:0.58'
      }
    },
    noData: {
      type: Boolean,
      default () {
        return false
      }
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    },
    fixedHeight: {
      type: Number,
      default () {
        return 0
      }
    },
    theme: [String, Object],
    initOptions: Object,
    group: String,
    autoresize: Boolean,
    watchShallow: Boolean,
    manualUpdate: Boolean
  },
  computed: {
    firstLoading(){
      if (this.loading && !this.record){
        this.record = true
        return  true
      }else {
        return false
      }
    }
  },
  data () {
    return {
      nodata: require('@/assets/images/icon-no-data.png'),
      lastArea: 0,
      height: 280,
      loadingOptions: {
        text: 'loading',
        color: '#1a78cf',
        textColor: '#ffffff',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
      },
      tooltipClassName: 'echarts-tooltip',
      width: 0
    }
  },
  watch: {
    group (group) {
      this.chart.group = group
    }
    // loading (value) {
    //   value ? this.showLoading('default', this.loadingOptions) : this.hideLoading()
    // }
  },
  methods: {
    // 设置高度
    setHeight () {
      if (this.fixedHeight !== 0) {
        this.$el.style.height = typeof this.fixedHeight === 'number' ? `${this.fixedHeight}px` : this.fixedHeight
        return
      }
      if (this.percentage === 'auto') {
        this.$el.style.height = '100%'
        return
      }
      const [ width, height ] = this.percentage.split(':').map(item => {
        return Number(item)
      })
      const percentage = height / width
      if (this.$el.offsetWidth === this.width) {
        return
      }
      this.width = this.$el.offsetWidth
      this.$el.style.height = `${Math.floor(this.$el.offsetWidth * percentage)}px`
    },

    mergeOptions (options, notMerge, lazyUpdate) {
      if (this.manualUpdate) {
        this.manualOptions = options
      }

      if (!this.chart) {
        this.init(options)
      } else {
        this.delegateMethod('setOption', options, notMerge, lazyUpdate)
      }
    },

    // resize
    resize (options) {
      this.delegateMethod('resize', options)
    },

    // 显示loading
    showLoading (type, options) {
      this.delegateMethod('showLoading', type, options)
    },

    // 隐藏loading
    hideLoading () {
      this.delegateMethod('hideLoading')
    },

    // 清除
    clear () {
      this.delegateMethod('clear')
    },

    // 销毁
    dispose () {
      this.delegateMethod('dispose')
    },

    // 调用echartsAPI
    delegateMethod (name, ...args) {
      if (!this.chart) {
        this.init()
      }
      return this.chart[name](...args)
    },

    delegateGet (methodName) {
      if (!this.chart) {
        this.init()
      }
      return this.chart[methodName]()
    },

    getArea () {
      return this.$el.offsetWidth * this.$el.offsetHeight
    },
    init (options) {
      this.setHeight()
      if (this.chart) {
        return
      }

      if (this.initOptions && Object.hasOwnProperty.call(this.initOptions, 'tooltip')) {
        this.initOptions.tooltip.className = this.tooltipClassName
      }
      if (this.manualOptions && Object.hasOwnProperty.call(this.manualOptions, 'tooltip')) {
        this.manualOptions.tooltip.className = this.tooltipClassName
      }
      if (this.options && Object.hasOwnProperty.call(this.options, 'tooltip')) {
        this.options.tooltip.className = this.tooltipClassName
      }
      if (options && Object.hasOwnProperty.call(options, 'tooltip')) {
        options.tooltip.className = this.tooltipClassName
      }
      const chart = echarts.init(this.$refs.chart, this.theme, this.initOptions)

      if (this.group) {
        chart.group = this.group
      }
      chart.setOption(options || this.manualOptions || this.options || {}, true)

      Object.keys(this.$listeners).forEach(event => {
        const handler = this.$listeners[event]

        if (event.indexOf('zr:') === 0) {
          chart.getZr().on(event.slice(3), handler)
        } else {
          chart.on(event, handler)
        }
      })

     setTimeout(()=> {
       if (this.autoresize) {
         this.lastArea = this.getArea()
         this.__resizeHandler = debounce(
           () => {
             this.setHeight()
             if (this.lastArea === 0) {
               // emulate initial render for initially hidden charts
               this.mergeOptions({}, true)
               this.resize()
               this.mergeOptions(this.options || this.manualOptions || {}, true)
             } else {
               this.resize()
             }
             this.lastArea = this.getArea()
           },
           100
         )
         addListener(this.$el, this.__resizeHandler)
       }
     }, 1000)

      Object.defineProperties(this, {
        width: {
          configurable: true,
          get: () => {
            return this.delegateGet('getWidth')
          }
        },
        height: {
          configurable: true,
          get: () => {
            return this.delegateGet('getHeight')
          }
        },
        isDisposed: {
          configurable: true,
          get: () => {
            return !!this.delegateGet('isDisposed')
          }
        },
        computedOptions: {
          configurable: true,
          get: () => {
            return this.delegateGet('getOption')
          }
        }
      })

      this.chart = chart
    },

    initOptionsWatcher () {
      if (this.__unwatchOptions) {
        this.__unwatchOptions()
        this.__unwatchOptions = null
      }

      if (!this.manualUpdate) {
        this.__unwatchOptions = this.$watch(
          'options',
          (val, oldVal) => {
            if (!this.chart && val) {
              this.init()
            } else {
              this.chart.clear()
              if (val && Object.hasOwnProperty.call(val, 'tooltip')) {
                val.tooltip.className = this.tooltipClassName
              }
              this.chart.setOption(val, val !== oldVal)
            }
          },
          { deep: !this.watchShallow }
        )
      }
    },

    // 销毁
    destroy () {
      if (this.autoresize) {
        removeListener(this.$el, this.__resizeHandler)
      }
      this.dispose()
      this.chart = null
    },

    // 重新初始化
    refresh () {
      if (this.chart) {
        this.destroy()
        this.init()
      }
    }
  },
  created () {
    this.initOptionsWatcher()

    INIT_TRIGGERS.forEach(prop => {
      this.$watch(
        prop,
        () => {
          this.refresh()
        },
        { deep: true }
      )
    })

    REWATCH_TRIGGERS.forEach(prop => {
      this.$watch(prop, () => {
        this.initOptionsWatcher()
        this.refresh()
      })
    })
  },
  mounted () {
    this.setHeight()
    if (this.options) {
      this.init()
    }
  },
  activated () {
    if (this.autoresize) {
      this.chart && this.chart.resize()
    }
  },
  destroyed () {
    if (this.chart) {
      this.destroy()
    }
  }
}
</script>
<style scoped lang="scss">
.chart-wrap{
  width: 100%;
  .echarts{
    width: 100%;
    height: 100%;
  }
  position: relative;
  .no-data{
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
}
</style>

