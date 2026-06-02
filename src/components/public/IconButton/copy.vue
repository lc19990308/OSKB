<template>
  <el-tooltip v-model="visible" manual :visible-arrow="false" :content="content" placement="top">
    <i class="iconfont iconfuzhi1" @click="copy()"></i>
  </el-tooltip>
</template>

<script>
import Copy from 'copy-util'
export default {
  name: 'copyButton',
  props: ['text'],
  data() {
    return {
      visible: false,
      content: '复制成功！'
    }
  },
  watch: {
    visible(v) {
      if (v) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.visible = false
          clearTimeout(this.timeout)
          this.timeout = null
        }, 2000)
      }
    }
  },
  methods: {
    copy() {
      const res = Copy(this.text)
      this.content = res ? '复制成功！' : '复制失败！'
      this.visible = true
    }
  }
}
</script>

<style scoped lang="scss">
.iconfuzhi1 {
  cursor: pointer;
  vertical-align: -1px;
  &:hover {
    color: #8B9CB0;
  }
}
</style>
