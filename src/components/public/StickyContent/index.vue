<template>
  <div
    class="sticky"
    ref="sticky"
    :style="{height: isSticky ? height : 'auto', zIndex:zIndex}"
  >
    <div
        class="sticky-container"
        :class="isSticky ? activeStickyClass : ''"
        :style="isSticky ? stickyStyle : ''"
    >
      <slot :sticky="isSticky"></slot>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { addListener, removeListener } from 'resize-detector'
export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0
    },
    offsetWidth: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 999
    },
    activeStickyClass: {
      type: String,
      default () {
        return ''
      }
    },
    parentDomClass: {
      type: String,
      default: 'main'
    }
  },
  data () {
    return {
      translateTop: 0,
      isSticky: false,
      width: '100%',
      height: 'auto',
      left: 0,
    }
  },
  computed: {
    stickyStyle () {
      return {
        position: 'fixed',
        top: this.stickyTop + 'px',
        width: (this.width + this.offsetWidth) + 'px',
        left: this.left + 'px',
        zIndex: 99
      }
    }
  },
  activated () {
    this.init()
  },
  deactivated () {
    this.clear()
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  destroyed () {
    this.clear()
  },
  methods: {
    init () {
      this.parentDom = document.getElementsByClassName(this.parentDomClass)[0]
      if (this.parentDom) {
        // this.height = this.$el.getBoundingClientRect().height
        // this.height = this.$refs.sticky.offsetHeight + 'px'
        this.height = this.$refs.sticky.getElementsByClassName('sticky-container')[0].offsetHeight + 'px'
        this.parentDom.addEventListener('scroll', this.handleScroll)
        addListener(this.parentDom, this.handleResize)
        this.handleScroll()
        this.handleResize()
      }
    },

    clear (){
      this.parentDom.removeEventListener('scroll', this.handleScroll)
      removeListener(this.parentDom, this.handleResize)
    },

    handleResize () {
      this.width = this.$refs.sticky.offsetWidth
      this.left = this.$refs.sticky.getBoundingClientRect().left
      this.height = this.$refs.sticky.getElementsByClassName('sticky-container')[0].offsetHeight + 'px'
    },

    handleScroll () {
      const offsetTop = this.$el.getBoundingClientRect().top
      this.isSticky = (offsetTop - this.stickyTop) <= 0
    }
  }
}
</script>
<style scoped lang="scss">
.sticky{
}
</style>
