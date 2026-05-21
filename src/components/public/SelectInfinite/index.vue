<template>
  <el-select
    ref="select"
    filterable
    remote
    v-on="$listeners"
    :filter-method="filterMethodFn"
    v-bind="$attrs"
  >
    <slot></slot>
    <p class="el-select-dropdown__empty" v-show="loading">加载中</p>
  </el-select>
</template>
<script>
/**  临时解决，待优化 ***/
import { debounce } from '@/utils'

export default {
  name:'SelectInfinite',
  props: {
    lazyLoad: {
      type: Function,
      default: () => {}
    },
    filterMethod: {
      type: Function,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default () { return false }
    }
  },
  data () {
    return {
      scrollWrap: null
    }
  },
  methods: {
    filterMethodFn () {
      this.filterMethod()
    },

    referenceInputChange () {
    },

    init () {
      const scrollbar = this.$refs.select.$refs.scrollbar

     const scrollWrap = this.scrollWrap = scrollbar.$el.getElementsByClassName('el-scrollbar__wrap')[0]
      if (scrollWrap) {
        scrollWrap.addEventListener('scroll', this.scroll)
      }
    },
    scroll: debounce(function () {
      this.lazyLoad()
    }, 200),
  },
  mounted() {
    this.init()
  },
  destroyed() {
    if (this.scrollWrap) {
      this.scrollWrap.removeEventListener('scroll', this.scroll)
    }
  }
}
</script>
<style>
</style>
