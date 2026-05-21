<template>
  <el-popover
    placement="bottom"
    width="240"
    v-model="similarityVisible"
    trigger="click">

    <div style="padding: 0 15px 20px  15px;">
      <el-slider
        v-bind="$attrs"
        range
        v-on="$listeners"
        input-size="mini"
        :marks="marks"
        :max="100">
      </el-slider>
    </div>

    <div class="text-center">
      <el-link type="primary" class="m-r-10" @click="[similarityVisible = false, $emit('filter')]" :underline="false">筛选</el-link>
      <el-link :underline="false" @click="[$emit('input', [0, 0]), similarityVisible = false, $emit('filter')]">重置</el-link>
    </div>
    <span :class="['cursor-pointer', { 'text-primary': value[0] || value[1] }]" slot="reference">相似度(%)<i class="iconfont iconloudou font-base" style="font-weight: normal;vertical-align: middle;"></i></span>
  </el-popover>
</template>

<script>
export default {
  name: 'SimilaritySliderPopover',
  data () {
    return {
      similarityVisible: false,
      marks: {
        20: '20%',
        50: '50%',
        80: '80%'
      }
    }
  },
  computed: {
    value () {
      return this.$attrs || [0, 0]
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-slider__marks-text) {
  color: #666666;
}
</style>
