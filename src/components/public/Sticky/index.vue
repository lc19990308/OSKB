<template>
  <div :style="{zIndex:zIndex}"
       :class="isSticky ? stickyClassName : ''">
    <div
        class="sticky-container"
        :class="className"
        :style="{top:(isSticky ? stickyTop +'px' : ''),zIndex:zIndex + ' !important',position:position,width:width}"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 2001
    },
    className: {
      type: String,
      default: ''
    },
    stickyClassName: {
      type: String,
      default: ''
    },
    parentDomClass: {
      type: String,
      default: 'main'
    }
  },
  data () {
    return {
      active: false,
      position: '',
      width: '100%',
      height: undefined,
      isSticky: false
    }
  },
  mounted () {
    this.parentDom = document.getElementsByClassName(this.parentDomClass)[0]
    if (this.parentDom) {
      // this.height = this.$el.getBoundingClientRect().height
      this.parentDom.addEventListener('scroll', this.handleScroll)
    }
  },
  activated () {
    this.handleScroll()
  },
  destroyed () {
    this.parentDom.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    sticky () {
      if (this.active) {
        return
      }
      this.position = 'absolute'
      this.active = true
      this.isSticky = true
    },
    handleReset () {
      if (!this.active) {
        return
      }
      this.reset()
    },
    reset () {
      this.position = ''
      this.active = false
      this.isSticky = false
    },
    handleScroll () {
      const offsetTop = this.$el.getBoundingClientRect().top
      const boundary = (this.parentDom.scrollHeight - this.parentDom.clientHeight - this.parentDom.scrollTop) > this.$el.clientHeight
      if (!boundary && this.parentDom.scrollTop !==0) return
      if (offsetTop < this.stickyTop) {
        this.sticky()
      }else {
        this.handleReset()
      }
    }
  }
}
</script>
