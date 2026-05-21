<template>
  <el-option :label="get(source, label, source)" :value="get(source, value, source)" :data-key="get(source, 'id')">
    <span>{{ source.name }}</span>
    <el-button
      icon="el-icon-tickets"
      circle
      style="opacity: 0;"
      class="m-l-10 btn-position"
      size="mini"
      @click.stop="detail(source)"
      v-if="source.id !== -1 && (authorityFilter(102) || source.userId === source.userId)"
    ></el-button>
  </el-option>
</template>

<script>
export default {
  name: 'ProItem',
  props: {
    source: { // 每一行的内容
      type: Object,
      default () {
        return {}
      }
    },
    label: { // 要显示的名称
      type: String
    },
    value: { // 绑定的值
      type: String
    }
  },
  inject: ['detail']
}
</script>
<style lang="scss" scoped>
.btn-position {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: auto;
  z-index: 99;
  cursor: pointer;
}
</style>

