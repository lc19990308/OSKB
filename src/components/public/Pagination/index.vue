<template>
  <el-pagination
    class="right"
    v-show="total > 0 || show"
    v-on="$listeners"
    v-bind="attr"
  >
    <slot></slot>
  </el-pagination>
</template>
<script>
/**
 * 我的PAGE_CONF是一个默认的配置
 * PAGE_CONF = {
 * layout: 'total, sizes, prev, pager, next, jumper',
 * pageSizes: [5, 10, 20, 50, 100],
 * pageSize: 10,
 * pageCount: 5,
 * prevText: '上一页',
 * nextText: '下一页'
 *}
 * */
import { PAGE_CONF } from '@/utils/conf'

export default {
  name: 'Pagination',
  data () {
    return {
      pageConf: PAGE_CONF
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    total () {
      return this.$attrs && this.hasAttr(this.$attrs, 'current-page') ? this.$attrs.total : 0
    },
    attr () {
      const pageConf = this.pageConf
      return {
        background: true,
        layout: pageConf.layout,
        'page-sizes': pageConf.pageSizes,
        'page-count': pageConf.pageCount,
        'prev-text': pageConf.prevText,
        'next-text': pageConf.nextText,
        ...this.$attrs
      }
    }
  },
  watch: {
    total (newVal) {
      const size = this.$attrs && this.hasAttr(this.$attrs, 'page-size') ? this.$attrs['page-size'] : 10
      const current = this.$attrs && this.hasAttr(this.$attrs, 'current-page') ? this.$attrs['current-page'] : 1
      if (Math.ceil(newVal / size) < current && this.hasAttr(this.$listeners, 'update:current-page')) {
        const currentPage = current - 1
        this.$emit('update:current-page', currentPage > 0 ? currentPage : 1)
        if (this.hasAttr(this.$listeners, 'current-change') && newVal > 0) {
          this.$emit('current-change', currentPage)
        }
      }
    }
  },
  methods: {
    hasAttr (data, attr) {
      return Object.prototype.hasOwnProperty.call(data, attr)
    }
  }
}
</script>
