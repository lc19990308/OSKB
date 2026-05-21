<template>
  <el-option :label="source[label]" :value="source[value]">
    <div class="select-item">
      <span>{{ source.version }}</span>
      <level-tag :level="source.security"></level-tag>
    </div>
  </el-option>
</template>

<script>
export default { name: 'optionItem' }
</script>
<script setup>
defineProps({
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
})
</script>
<style scoped>
.select-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
