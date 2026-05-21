<template>
  <!-- 时间选择器 -->
  <span class="right-float">
    <el-date-picker
      class="w-full"
      v-bind="$attrs"
      v-on="$listeners"
      size="medium"
      type="datetimerange"
      range-separator="-"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
    >
    </el-date-picker>
  </span>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'SearchDate'
})
</script>

<style lang="scss" scoped>
.right-float {
  float: right;
  margin-right:10px;
  width: 315px;
}
</style>
