<template>
<el-col class="query-box-item" :span="span">
  <label class="query-box-item__label" :style="{width: (labelWidth ? labelWidth : parentLabelWidth) + 'px'}">
    <slot name="label">{{ label }}</slot>
  </label>
  <div class="query-box-item__content">
    <slot></slot>
  </div>
</el-col>
</template>

<script>
export default {
  name: 'QueryBoxItem',
  props:{
    label: String,
    labelWidth: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      elFormItemSize: 'medium'
    }
  },
  computed:{
    parentLabelWidth(){
      return this.QueryBox.labelWidth
    },
    span(){
      return 24 / this.QueryBox.row
    }
  },
  inject: ['QueryBox'],
  provide() {
    return {
      elFormItem: this
    };
  }
}
</script>
<style lang="scss" scoped>
.query-box-item{
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  .query-box-item__label{
    color: #1B2838;
    font-size: 14px;
    line-height: normal;
    text-align: right;

  }
  .query-box-item__content{
    flex: 1;
  }
}
</style>
