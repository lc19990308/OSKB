<template>
  <el-tooltip :disabled="!isEllipsis" effect="dark" placement="top">
    <div slot="content" style="max-width: 400px;">
      {{content}}
    </div>
    <div class="ellipsis-box">
      <slot>{{ content }}</slot>
    </div>
  </el-tooltip>
</template>

<script>

export default {
  name: 'ellipsis',
  props: ['content'],
  data () {
    return {
      isEllipsis: false,
      dom: ''
    }
  },
  watch: {
    content: {
      handler () {
        this.$nextTick(() => {
          this.hasEllipsis()
        })
      },
      immediate: true
    }
  },
  methods: {
    hasEllipsis (a) {
      setTimeout(() => {
        const el = this.$el
        this.isEllipsis = el.scrollWidth > el.offsetWidth

        if (this.isEllipsis) {
          el.querySelectorAll('*').forEach((elm) => {
            elm.style.display = 'inline'
          })
        }
      }, 100)
    }
  }
}
</script>

<style scoped>
.ellipsis-box {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
