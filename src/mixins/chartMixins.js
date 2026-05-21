import { debounce } from '@/utils'
import { addListener, removeListener } from 'resize-detector'

/**
 * 处理图表文字 size
 */
export default {
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
      // if (!this.windowWidth) return
      // const fontSize = 100 * (this.windowWidth / 1920)
      // return size * fontSize
      return 12
    }
  },
  mounted () {
    // this.init()
  },
  destroy () {
    if (this.$el && this.__resizeHandler) {
      removeListener(this.$el, this.__resizeHandler)
    }
  }
}
