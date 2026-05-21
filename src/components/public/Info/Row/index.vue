<template>
  <el-col class="info-row">
    <slot></slot>
  </el-col>
</template>
<script>

export default {
  name: 'InfoRow',
  data () {
    return {}
  }
}

</script>
<style lang="scss" scoped>
.info-row{
  border-bottom: 1px solid #f3f4f4;
}
</style>
