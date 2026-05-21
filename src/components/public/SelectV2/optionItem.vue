<template>
  <el-option :label="get(source, label, source)" :value="get(source, value, source)">
    <slot :row="source"></slot>
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
  },
})
</script>


