<template>
  <div class="info">
    <slot name="title" v-if="$slots.title"></slot>
    <h3 class="headline" v-else-if="title">{{ title }}</h3>
    <el-row ref="row" class="info-content">
      <slot></slot>
    </el-row>
  </div>
</template>
<script>

export default {
  name: 'InfoWrap',
  data () {
    return {}
  },
  props: {
    title: String,
    ellipsis: {
      type: Boolean,
      default: true
    }
  },
  provide(){
    return {
      ellipsis: this.ellipsis
    }
  },
  computed: {
  }
}

</script>
<style lang="scss">
.info {
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
  .info-content{
    //border: 1px solid #f3f4f4;
    //border-radius: 3px;
  }
}

</style>
